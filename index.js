const mongoose = require("mongoose")


const { Client } = require("discord.js")
const { token , connect } = require("./config.json")

const loadCommands = require("./Handles/Commands/load-commands")
const loadListeners = require("./Handles/Listener/load-listeners.js")
//const loadListeners = require("")

const client = new Client({ 
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

client.setMaxListeners(100)
client.on("ready", () =>
{
    console.log("Bot started.")
    //loadMessages(client)
    loadCommands(client)
    loadListeners(client)
})
client.login(token)
