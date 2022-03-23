import { MessageEmbed } from "discord.js";

export default async function handleReport(interaction) {
  if (interaction.customId === "ignore") {
    const newEmbed = interaction.message.embeds[0]
      .setTitle("Marked as ignored")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Marked as ignored", ephemeral: true });
  }
  console.log(interaction.message.embeds[0].author.iconURL);
}
