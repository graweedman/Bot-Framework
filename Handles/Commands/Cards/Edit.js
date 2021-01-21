const CardManager = require("../../Cards/CardsManager")
const moment = require("moment")
const {MessageEmbed, User} = require("discord.js")
const { Collection } = require("mongoose")

module.exports = {
    commands: ["edit"],
    expectedArgs: "<id> <name> <rarity> <value> <image>",
    permissionError: "You do not have required permissions",
    description: "Edits selected card",
    requiredRoles: ["795403926412853260", "795403419091075118"],
    minArgs: 5,
    maxArgs: 5,
    callBack: (message, arguments, text) => {

        const {author} = message
        const collection = (message, Card) =>
        {
            message.react('✅').then(() => message.react('❎'))

            const filter = (reaction,user) => {
                console.log(user.id === author.id)
                const filter = ['✅','❎'].includes(reaction.emoji.name) && user !== message.author && user.id === author.id
                if(filter)
                {
                    return true
                }
                return false

            }

            message.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(collected =>
                {
                    const reaction = collected.first();
                    
                    if(reaction.emoji.name === '✅')
                    {
                        //console.log({user ,reaction})
                        Card.save()
                        message.edit(`Card edited`)
                    }
                    else{
                        message.edit(`Card edit canceled`)
                    }
                })
            .catch(collected=>
                {
                    message.edit(`Response Timeout`)
                })
        }
        const editCard = (Card) =>
        {
            let pass = true
            for(let i = 1; i<5; i++)
            {
                if(!arguments[i])
                {
                    message.channel.send("Wrong values provided")
                    pass = false
                    break
                }
            }
            if(!pass)return
            Card.name = (arguments[1] === "u" ) ? Card.name : arguments[1]
            Card.rarity = (arguments[2] === "u" ) ? Card.rarity : parseInt(arguments[2])
            Card.value = (arguments[3] === "u" ) ? Card.value : parseInt(arguments[3])
            Card.image = (arguments[4] === "u" ) ? Card.image : arguments[4]
            message.channel.send(
            `Card changed to:\n>Name: ${Card.name},\n>rarity: ${CardManager.rarities[Card.rarity].name},\n>value: ${Card.value},\n>image: ${Card.image}`
            ).then(message => collection(message,Card)
            )
        }



        CardManager.Card({id:arguments[0]}, editCard)
    }

}