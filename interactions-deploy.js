import "dotenv/config";
import fetch from "node-fetch";

// more info here: https://discord.com/developers/docs/interactions/application-commands#registering-a-command
const interaction_url = `https://discord.com/api/v9/applications/${process.env.APPLICATION_ID}/commands`; // this is for global command btw
const guild_interaction_url = `https://discord.com/api/v9/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`; // and this is for local server command

const interaction_json_body = {
  name: "Report to server mods",
  type: 3,
};

const response = await fetch(interaction_url, {
  method: "POST",
  body: JSON.stringify(interaction_json_body),
  headers: {
    Authorization: `Bot ${process.env.TOKEN}`,
    "Content-Type": "application/json",
  },
});
console.log(response);
