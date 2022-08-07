import "dotenv/config";
import { Client, Intents, MessageEmbed } from "discord.js";
import { showReportModal } from "./modules/handleReport.js";
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
  import("./modules/handleNewGuild.js");
  client.user.setActivity(`${client.guilds.cache.size} servers`, {
    type: "WATCHING",
  });
});

client.login(process.env.TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isMessageContextMenu()) {
    try {
      showReportModal(interaction);
    } catch (error) {
      interaction.reply({
        content: "Sorry, something went wrong.",
        ephemeral: true,
      });
    }
  } else if (interaction.isModalSubmit()) {
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
    // Code from https://stackoverflow.com/q/36098913
    function secondsToDays(seconds) {
      seconds = Number(seconds);
      let d = Math.floor(seconds / (3600 * 24));
      let h = Math.floor((seconds % (3600 * 24)) / 3600);
      let m = Math.floor((seconds % 3600) / 60);
      let s = Math.floor(seconds % 60);

      let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    message.channel.send(
      `In ${client.guilds.cache.size} servers!\nUptime: ${secondsToDays(
        Math.floor(process.uptime())
      )}`
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
