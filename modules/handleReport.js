import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

const optionsRow1 = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("mute")
    .setLabel("Mute for 24 hours")
    .setStyle("DANGER"),
  new MessageButton()
    .setCustomId("kick")
    .setLabel("Kick User")
    .setStyle("DANGER"),
  new MessageButton().setCustomId("ban").setLabel("Ban User").setStyle("DANGER")
);

const optionsRow2 = (interaction) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("ignore")
      .setLabel("Ignore Report")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setStyle("LINK")
      .setLabel("View Message in context")
      .setURL(interaction.targetMessage.url)
  );
};

export default async function handleReport(interaction) {
  const createChannelButtonRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("createReportChannel")
      .setLabel("Create Report Channel")
      .setStyle("PRIMARY")
      .setEmoji("✨")
  );

  const channels = await interaction.guild.channels.fetch();
  const modChannel = channels.find(
    (channel) => channel.name === "rebot-reports"
  );
  //   console.log(modChannel);

  if (!modChannel) {
    return await interaction.reply({
      content:
        "No reports channel found. If you are a server admin, please create a **private** channel with the name #`rebot-reports`.",
      ephemeral: true,
      components: [createChannelButtonRow],
    });
  } else {
    try {
      await modChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(interaction.targetMessage.content + "\n\n")
            .setAuthor({
              name: interaction.targetMessage.author.tag,
              iconURL: interaction.targetMessage.author.displayAvatarURL(),
            })
            .addField("Reported by", `<@!${interaction.user.id}>`, true)
            .addField("Reason provided?", `No reason provided.`, true)
            .setFooter(interaction.targetMessage.author.id)
            .setTimestamp(),
        ],
        components: [optionsRow1, optionsRow2(interaction)],
      });
    } catch (error) {
      console.log(error.code);

      if (error.code === 50001 || error.code === 50013) {
        return interaction.reply({
          content:
            "The bot wasn't set up correctly.\nIf you are a server admin, please make sure the bot has permission to post messages in the #rebot-reports channel!",
          ephemeral: true,
        });
      }

      return interaction.reply({
        content:
          "Sorry, something went wrong. Please try again later or contact the server admin.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "This message has been reported to server moderators!",
      ephemeral: true,
    });
  }
}

export { optionsRow1, optionsRow2 };
