const CardManager = require("../Cards/CardManager")

module.exports = {
    commands: ["test"],
    expectedArgs: "<index> <value>",
    permissionError: "You do not have required permissions",
    description: "Test Command",
    minArgs: 2,
    maxArgs: 2,
    callBack: (message, arguments) => {
        let tradingCards = CardManager.getCardArray();
        message.channel.send(`Test Command ${tradingCards[parseInt(arguments[0])][arguments[1]]}`)
    },
    requiredRoles: [],

}