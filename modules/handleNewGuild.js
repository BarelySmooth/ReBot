global.client.on("guildCreate", async (guild) => {
  global.client.user.setActivity(`${global.client.guilds.cache.size} servers`, {
    type: "WATCHING",
  });

  const channels = await guild.channels.fetch();
  const modChannel = channels.find(
    (channel) => channel.name === "rebot-reports"
  );

  if (modChannel) return; // Don't do anything if the channel already exists

  try {
    // TODO: Blocks v14
    // Invalid form body error
    // To repro: Kick the bot from the server, and invite it again.
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
