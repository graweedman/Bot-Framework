const CardManager = require("../../Cards/CardsManager")
const UserManager = require("../../Users/UserManager")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["givecard"],
    expectedArgs: "<User> <Name or ID>",
    permissionError: "You do not have required permissions",
    description: "Gives the specified user a card",
    requiredRoles: ["795403926412853260", "795403419091075118"],
    minArgs: 2,
    maxArgs: 2,
    callBack: (message, arguments, text) => {
        let card = arguments[1];
        let check = {name: card.toLowerCase()}
        if(!isNaN(card)) {
            check = {id: parseInt(card)}
        }
        
        const ShowCard = (Card) =>
        {
            if(Card === 1) {
                message.channel.send("Card doesn't exist.");
                return;
            }

            UserManager.User(message.mentions.members.first(),(User) =>
            {
                CardManager.addCard(User, Card) 
            })
            message.channel.send(`Okay ${message.author}, gave ${message.mentions.members.first()} **${CardManager.capFirstLetter(Card.name)}**!`)
        }
       
        CardManager.Card(check,ShowCard)
    }

}