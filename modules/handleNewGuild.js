global.client.on("guildCreate", async (guild) => {
  guild.channels.fetch().then(async (channels) => {
    let arrayOfChannels = [];
    channels.forEach(async (channel) => {
      arrayOfChannels.push(channel.name);
    });

    try {
      if (!arrayOfChannels.includes("rebot-reports")) {
        await guild.channels.create("rebot-reports");
      }
    } catch (error) {
      console.log(error);
    }
  });
});
