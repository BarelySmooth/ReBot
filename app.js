import "dotenv/config";
import { Client, Intents, MessageEmbed } from "discord.js";
import handleReport from "./modules/handleReport.js";
import handleButtons from "./modules/handleButtons.js";

global.client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isMessageContextMenu()) {
    handleReport(interaction);
  } else if (interaction.isButton()) {
    handleButtons(interaction);
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
