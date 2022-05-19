import { MessageEmbed } from "discord.js";

export default async function handleReport(interaction) {
  if (interaction.customId === "ignore") {
    const newEmbed = interaction.message.embeds[0]
      .setTitle("Marked as ignored")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Marked as ignored", ephemeral: true });
  } else if (interaction.customId === "mute") {
    const userIdOfMemberToMute = interaction.message.embeds[0].footer.text;
    await interaction.guild.members.fetch();

    try {
      await interaction.guild.members.cache
        .get(userIdOfMemberToMute)
        .timeout(24 * 60 * 60 * 1000, `Muted by ${interaction.user.tag}`);
    } catch (error) {
      return interaction.reply({
        content:
          "Sorry, something went wrong. The member might not be in the server.",
        ephemeral: true,
      });
    }

    const newEmbed = interaction.message.embeds[0]
      .setTitle("Muted for 24 hours")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Muted for 24 hours", ephemeral: true });
  } else if (interaction.customId === "kick") {
    const userIdOfMemberToKick = interaction.message.embeds[0].footer.text;
    await interaction.guild.members.fetch();

    try {
      await interaction.guild.members.cache
        .get(userIdOfMemberToKick)
        .kick(`Kicked by ${interaction.user.tag}`);
    } catch (error) {
      return interaction.reply({
        content:
          "Sorry, something went wrong. The member might not be in the server.",
        ephemeral: true,
      });
    }

    const newEmbed = interaction.message.embeds[0]
      .setTitle("Kicked")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Kicked", ephemeral: true });
  } else if (interaction.customId === "ban") {
    const userIdOfMemberToBan = interaction.message.embeds[0].footer.text;
    await interaction.guild.members.fetch();

    try {
      await interaction.guild.members.cache
        .get(userIdOfMemberToBan)
        .ban({ reason: `Banned by ${interaction.user.tag}` });
    } catch (err) {
      console.log(err);
      return interaction.reply({
        content:
          "Couldn't ban member! Check if the member is already banned/kicked.",
        ephemeral: true,
      });
    }

    const newEmbed = interaction.message.embeds[0]
      .setTitle("Banned")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Banned", ephemeral: true });
  }

  // console.log(interaction.message.embeds[0].author.iconURL);
}
