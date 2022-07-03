global.client.on("guildCreate", async (guild) => {
  const channels = await guild.channels.fetch();
  const modChannel = channels.find(
    (channel) => channel.name === "rebot-reports"
  );

  if (modChannel) return; // Don't do anything if the channel already exists

  try {
    await guild.channels.create("rebot-reports", {
      type: "GUILD_TEXT",
      permissionOverwrites: [
        {
          id: client.user,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
        {
          id: guild.roles.everyone,
          deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
});
