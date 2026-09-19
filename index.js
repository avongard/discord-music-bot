const { Events, Client, GatewayIntentBits, ApplicationCommandOptionType } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const { YoutubeExtractor } = require("discord-player-youtubei");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client);

client.once(Events.ClientReady, async () => {
    await player.extractors.loadMulti(DefaultExtractors);
    await player.extractors.register(YoutubeExtractor, {});
    console.log('Extractors loaded:', player.extractors.store.size);
    console.log('Ready!');
});

client.on("error", console.error);
client.on("warn", console.warn);

player.events.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.events.on("playerError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.events.on("playerStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.channel.name}**!`);
});

player.events.on("audioTrackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.events.on("disconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.events.on("emptyChannel", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.events.on("emptyQueue", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "query",
                        type: ApplicationCommandOptionType.String,
                        description: "The song you want to play",
                        required: true
                    }
                ]
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "queue",
                description: "See the queue"
            },
            {
                name: "stop",
                description: "Stop the player"
            },
        ]);

        await message.reply("Deployed!");
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "play") {
        const query = interaction.options.getString("query");
        const voiceChannel = interaction.member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: "❌ | You need to be in a voice channel to play music!", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const { track } = await player.play(voiceChannel, query, {
                searchEngine: QueryType.YOUTUBE_SEARCH,
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: true,
                    leaveOnEnd: true
                }
            });

            await interaction.followUp(`✅ | **${track.title}** enqueued!`);
        } catch (error) {
            console.error(error);
            await interaction.followUp(`❌ | Something went wrong: ${error.message}`);
        }
    }

    if (commandName === "skip") {
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "❌ | No music is currently playing!", ephemeral: true });
        }

        const currentTrack = queue.currentTrack;
        const success = queue.node.skip();
        return interaction.reply(success ? `⏭ | Skipped **${currentTrack.title}**!` : "❌ | Something went wrong!");
    }

    if (commandName === "queue") {
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.tracks || queue.tracks.size === 0) {
            return interaction.reply({ content: "❌ | The queue is currently empty!", ephemeral: true });
        }

        const tracks = queue.tracks.toArray().map((track, i) => `${i + 1}. **${track.title}**`).slice(0, 10);

        return interaction.reply({
            content: `🎶 | Current queue:\n${tracks.join("\n")}${queue.currentTrack ? `\n\nNow playing: **${queue.currentTrack.title}**` : ""}`
        });
    }

    if (commandName === "stop") {
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "❌ | No music is currently playing!", ephemeral: true });
        }

        queue.delete();
        return interaction.reply("⏹ | Stopped the music and cleared the queue!");
    }
});

player.events.on("debug", (queue, message) => console.log(`[Debug]: ${message}`));
player.on("debug", (message) => console.log(`[Player Debug]: ${message}`));

client.login(config.token);
