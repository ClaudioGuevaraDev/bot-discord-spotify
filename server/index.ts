import { Client, GatewayIntentBits } from "discord.js";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { DISCORD_BOT_TOKEN } from "./config";
import path from "path";

const audioPlayer = createAudioPlayer();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", () => {
  console.log(`Bot ${client.user?.tag} is ready!`);
});

client.on("messageCreate", (message) => {
  if (message.content === "ping") {
    const voiceChannel = message.member?.voice.channel;

    if (voiceChannel != null) {
      try {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(
          path.join(__dirname, "file_example_MP3_700KB.mp3")
        );
        audioPlayer.play(resource);
        connection.subscribe(audioPlayer);
      } catch (error) {
        message.channel.send("Error al reproducir el audio");
      }
    } else {
      message.channel.send("Debes estar en un canal");
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
