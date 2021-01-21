const CardManager = require("../../Cards/CardsManager")
const {MessageEmbed, User} = require("discord.js")
const {capitalize} = require("../../Basics/OutputEditing")

module.exports = {
    commands: ["list"],
    expectedArgs: "",
    permissionError: "You do not have required permissions",
    description: "Lists all cards",
    requiredRoles: ["795403926412853260", "795403419091075118"],
    minArgs: 0,
    maxArgs: 0,
    callBack: (message, arguments, text) => {
        const ListCards = (Cards) =>
        {
            var ToSend = "**Card List**:\n"
            
            for(const card of Cards)
            {
                ToSend += `**${capitalize(card.name)}** ━ *${CardManager.rarities[card.rarity].name}* ━ id: ${card.id}\n`
            }

            message.channel.send(ToSend)
        } 

        CardManager.Cards(ListCards)
    }

}