import "dotenv/config";
import { Client, Intents, MessageEmbed } from "discord.js";
import handleReport from "./modules/handleReport.js";
import handleButtons from "./modules/handleButtons.js";

global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isMessageContextMenu()) {
    try {
      handleReport(interaction);
    } catch (error) {
      interaction.reply({
        content: "Sorry, something went wrong.",
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    try {
      handleButtons(interaction);
    } catch (error) {
      interaction.reply({
        content:
          "Hmm... there was an error. Are you sure the bot has moderation permissions?",
        ephemeral: true,
      });
    }
  }
});

client.on("channelCreate", async (channel) => {
  if (channel.name === "rebot-reports") {
    await channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("#ff0000")
          .setTitle("This channel will be used as the ReBot reports channel!")
          .setDescription(
            "Reported messages will be posted here and you will be able to take action against them."
          ),
      ],
    });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "!rebot uptime") {
    message.channel.send(
      `Uptime: ${Math.round(process.uptime() / 60)} minutes`
    );
  } else if (message.content === "!rebot help") {
    message.channel.send(
      `
      To set up ReBot, create a **private** channel with the name #\`rebot-reports\`.
      If you want to report a message, right click the message, and click "Apps > Report to server mods".
      `
    );
  }
});
