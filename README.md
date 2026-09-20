# Discord Music Bot

A simple Discord music bot built with [discord.js](https://discord.js.org/) v14 and [discord-player](https://discord-player.js.org/) v7, capable of streaming music from YouTube and Spotify directly into your server's voice channels.

## Features

- Play songs from YouTube via search or direct link
- Play songs from Spotify via direct link
- Playlist support for both YouTube and Spotify
- Skip tracks
- View the current queue
- Stop playback and clear the queue
- Automatically leaves the voice channel when idle or empty

## Commands

| Command | Description |
|---|---|
| `/play [song name or URL]` | Plays a song from YouTube (joins your voice channel) |
| `/skip` | Skips the current song |
| `/queue` | Shows the current song queue |
| `/stop` | Stops playback and clears the queue |

> You must be in a voice channel to use `/play`.

## Requirements

- [Node.js](https://nodejs.org/) v18 or newer
- [FFmpeg](https://ffmpeg.org/) via npm dependencies
- [Discord Bot Application](https://discord.com/developers/applications) with a bot token

## Bot Setup

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/home)

2. Create a new application

3. In the Bot tab click Add Bot and check the following boxes:

<img width="1404" height="321" alt="{0C9B4D82-988E-41EC-8680-702174C8B335}" src="https://github.com/user-attachments/assets/9753918b-d070-4d88-86f7-5232add02544" />

4. In the OAuth2 tab check the following boxes:

<img width="1101" height="343" alt="{FBC2D641-9C15-498C-BF81-5E810BE89041}" src="https://github.com/user-attachments/assets/ac687318-664c-4815-b915-e717fe49960e" />

<img width="1130" height="583" alt="{25A521D0-8784-4488-8981-94D3761B2087}" src="https://github.com/user-attachments/assets/ba642bf5-1231-4a39-ba85-ae928e64e02d" />

5. Then copy the URL at the bottom of the page and paste into your browser to invite the bot.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/avongard/discord-music-bot.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `config.json` file in the root directory:
   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN"
   }
   ```

4. In the [Discord Developer Portal](https://discord.com/developers/applications), under your bot's settings, enable the **Message Content Intent** under the "Privileged Gateway Intents" section.

5. Invite your bot to your server using the OAuth2 URL generator in the Developer Portal, with the following scopes and permissions:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Connect`, `Speak`, `Read Message History`

## Usage

1. Start the bot:
   ```bash
   node index.js
   ```

2. In any text channel the bot can see, type `!deploy` (as the bot application's owner) to register the slash commands to that server.

3. Once deployed, use `/play`, `/skip`, `/queue`, and `/stop` in any channel.

## Running 24/7

To keep the bot online continuously, consider:
- Using [PM2](https://pm2.keymetrics.io/) to manage the process and auto-restart on crash or reboot
- Hosting on a small VPS

## Stack

- [discord.js](https://discord.js.org/) v14
- [discord-player](https://discord-player.js.org/) v7
- [@discord-player/extractor](https://www.npmjs.com/package/@discord-player/extractor)
- [discord-player-youtubei](https://www.npmjs.com/package/discord-player-youtubei)

## Notes

- This repo will maintain development.
- If there are any issues, please let me know.
- I hope you enjoy.
