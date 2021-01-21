const CardManager = require("../../Cards/CardsManager")
const moment = require("moment")
const chance = require("chance")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["draw"],
    expectedArgs: "<Rarity> ",
    permissionError: "You do not have required permissions",
    description: "Draws a card",
    requiredRoles: ["795403926412853260", "795403419091075118"],
    minArgs: 0,
    maxArgs: 1,
    callBack: (message, arguments, text) => {
        const addCard = (Card) =>
        {
            
        }

        CardManager.Cards((Cards)=>
        {
            chance.integer()


            CardManager.Card(query, addCard)
        })


        
    }

}