const CardManager = require("../../Cards/CardsManager")
const UserManager = require("../../Users/UserManager")
const moment = require("moment")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["view","v"],
    expectedArgs: "<Name or ID>",
    permissionError: "You do not have required permissions",
    description: "View a card",
    requiredRoles: [],
    minArgs: 1,
    maxArgs: 1,
    callBack: (message, arguments, text) => {
        let UserHas = false
        let card = arguments[0];
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
            UserManager.User(message.author,(User) => checkCard(User,Card))
        } 

        const checkCard = (User,Card) =>
        {
            card = User.cards.find(card => card.id === Card.id)
            if(card)
            {
                if(!card.count || card.count <1) card = false
            }
            if(!card)
            {
                message.channel.send(`You don't own **${CardManager.capFirstLetter(Card.name)}**, you can't view it. <:shibaNervous:797909334607921194>`)
                return
            }
            message.channel.send({ embed: CardManager.embed(Card)});
        }
        
       
        CardManager.Card(check,ShowCard)
    }

}