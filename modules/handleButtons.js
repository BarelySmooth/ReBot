import {
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
} from "discord.js";

export default async function handleReport(interaction) {
  if (["ignore", "mute", "kick", "ban"].includes(interaction.customId)) {
    if (
      !interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return interaction.reply({
        content:
          "You do not have permission to do this. Only moderators can take action on reports. (make sure you have the `KICK_MEMBERS` permission)",
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === "ignore") {
    const newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
      .setTitle("Marked as ignored")
      .setColor("#90ee90");

    const markAsIgnoredButton = interaction.message.components[1].components[0];
    let newButton = ButtonBuilder.from(markAsIgnoredButton).setDisabled();
    let newActionRow = new ActionRowBuilder().addComponents(
      newButton,
      interaction.message.components[1].components[1]
    );

    interaction.message.edit({
      embeds: [newEmbed],
      components: [newActionRow],
    });
    interaction.reply({ content: "Marked as ignored", ephemeral: true });
  } else if (interaction.customId === "mute") {
    const userIdOfMemberToMute = interaction.message.embeds[0].footer.text;
    await interaction.guild.members.fetch();

    try {
      await interaction.guild.members.cache
        .get(userIdOfMemberToMute)
        .timeout(24 * 60 * 60 * 1000, `Muted by ${interaction.user.tag}`);
    } catch (error) {
      console.log(error);

      return interaction.reply({
        content:
          "Sorry, something went wrong. The member might not be in the server or the bot doesn't have permission to timeout the member. \n(PS: Some servers still don't have access to timeouts)",
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
          "Whoops, something went wrong! The member might not be in the server or the bot doesn't have permission to kick the user.",
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
          "Couldn't ban member! This is probably because the bot doesn't have permission to ban this member or the member has already been banned/kicked.",
        ephemeral: true,
      });
    }

    const newEmbed = interaction.message.embeds[0]
      .setTitle("Banned")
      .setColor("#90ee90");
    interaction.message.components[0].setComponents([]);
    interaction.message.edit({ embeds: [newEmbed] });
    interaction.reply({ content: "Banned", ephemeral: true });
  } else if (interaction.customId === "createReportChannel") {
    const author = interaction.member;
    const channels = await interaction.guild.channels.fetch();
    const modChannel = channels.find(
      (channel) => channel.name === "rebot-reports"
    );

    if (modChannel) {
      return interaction.reply({
        content:
          "A report channel already exists! Try reporting the message again.",
        ephemeral: true,
      });
    }

    if (!author.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({
        content: `<@${author.id}> You don't have permission to create a report channel. Only a server admin can do that :)`,
        ephemeral: true,
      });
    } else {
      try {
        await interaction.guild.channels.create("rebot-reports", {
          type: "GUILD_TEXT",
          permissionOverwrites: [
            {
              id: client.user,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
          ],
        });

        await interaction.reply({
          content: `<@${author.id}> Created a new report channel!`,
          ephemeral: true,
        });
      } catch (error) {
        console.log(error);
        return interaction.reply({
          content: `<@${author.id}> Couldn't create a report channel. Please make sure the bot has permission to create channels.`,
          ephemeral: true,
        });
      }
    }
  }
}
