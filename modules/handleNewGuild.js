global.client.on("guildCreate", async (guild) => {
  //TODO: use code from handleButtons.js file (check the end of the file)
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
