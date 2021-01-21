const Chance = require("chance")

module.exports = {
    commands: ["name","oc"],
    description: "Generates a random name",
    callBack: (message, arguments, text) => {
            message.channel.send(Chance().name())
    },

}