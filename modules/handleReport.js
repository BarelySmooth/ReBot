import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} from "discord.js";

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

async function postReport(modalInteraction, interaction) {
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

  if (!modChannel) {
    return await modalInteraction.reply({
      content:
        "No reports channel found. If you are a server admin, please create a **private** channel with the name #`rebot-reports`.",
      ephemeral: true,
      components: [createChannelButtonRow],
    });
  }

  let interactionReplied = false;
  // default limit is 50 anyway, just making this clearer
  // prettier-ignore
  await modChannel.messages.fetch({ limit: 50 }).then((messages) => {
    messages.forEach((message) => {
      // checking whether the message was posted by the bot itself
      // message.client.user.id will return the bot's account ID
      if (message.author.id != message.client.user.id) return;

      // get the last embed on the message...
      const reportEmbed = message.embeds[message.embeds.length - 1]

      // checking if the desciption of the embed is the same as that of the reported message AND if the message being reported has the same message ID as the one on the embed      
      if ((reportEmbed?.description === interaction.targetMessage.content) && (message.components[1].components[1].url === interaction.targetMessage.url)) {
        // making sure the same user is not reporting the message again
        if (!reportEmbed.fields[0].value.includes(interaction.user.id)) {
          reportEmbed.fields[0].value += `\n<@!${interaction.user.id}>`;
          message.edit({
            embeds: [reportEmbed],
          });

          interactionReplied = true
          return modalInteraction.reply({
            content: "This message has been reported to server moderators!",
            ephemeral: true,
          })
        } else {
          interactionReplied = true
          return modalInteraction.reply({
            content: "You've already reported this message!",
            ephemeral: true,
          });
        }
      }
    });
  });

  if (interactionReplied) return;

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
          .addField(
            "Reason provided?",
            modalInteraction.fields.getTextInputValue("reason_field"),
            true
          )
          .setFooter(interaction.targetMessage.author.id)
          .setTimestamp(),
      ],
      components: [optionsRow1, optionsRow2(interaction)],
    });
  } catch (error) {
    console.log(error.code);

    if (error.code === 50001 || error.code === 50013) {
      return modalInteraction.reply({
        content:
          "The bot wasn't set up correctly.\nIf you are a server admin, please make sure the bot has permission to post messages in the #rebot-reports channel!",
        ephemeral: true,
      });
    }

    return modalInteraction.reply({
      content:
        "Sorry, something went wrong. Please try again later or contact the server admin.",
      ephemeral: true,
    });
  }

  return modalInteraction.reply({
    content: "This message has been reported to server moderators!",
    ephemeral: true,
  });
}

export async function showReportModal(interaction) {
  const reasonModal = new Modal().setCustomId("reasonModal").setTitle("Reason");

  const reason_input = new TextInputComponent()
    .setCustomId("reason_field")
    .setLabel("Reason for reporting")
    .setStyle("SHORT");

  const reasonFieldRow = new MessageActionRow().addComponents(reason_input);
  reasonModal.addComponents(reasonFieldRow);

  await interaction.showModal(reasonModal);

  const filter = (interaction) => interaction.customId === "reasonModal";
  interaction
    .awaitModalSubmit({ filter, time: 300000 })
    .then((modalInteraction) => {
      console.log(`${modalInteraction.customId} was submitted!`);

      try {
        postReport(modalInteraction, interaction);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(console.error);
}

export { optionsRow1, optionsRow2 };
