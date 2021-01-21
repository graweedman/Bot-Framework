let Cooldown = false;
const Chance = require("chance");
const UserManager = require("../../Users/UserManager")
const CardManager = require("../../Cards/CardsManager")
const {MessageEmbed} = require("discord.js")
const {capitalize} = require("../../Basics/OutputEditing")

module.exports = {
    condition: (message) =>
    {
        const {member} = message
        if(message.author.bot)return false
        if(message.content === "forcespawn" && (message.author.id === "779996172793544735"|| message.author.id === "272697254165348353")) return true;
        if(Cooldown)return false
        return true
    },
    callBack: (message) =>
    {
        let emoji = {
            real:"<:DVA:797301634547712011>",
            id:"797301634547712011"
        }

        const isForceSpawn = (message.content === "forcespawn" && (message.author.id === "779996172793544735"|| message.author.id === "272697254165348353"));

        if(!isForceSpawn) { 
            Cooldown = true 
            setTimeout(() => {
                Cooldown = false
                }, 600000);
            const chance = new Chance()
            if(chance.bool({likelihood: 90})) return false
        }

        const ShowDrawn = (cards) => {
            let card = CardManager.drawCard(cards)
            CardManager.Card({id:card},displayCard)
        }  
        
        const displayCard = (Card) =>
        {
            if (Card === 1) return false;
            const {
                channel
            } = message
            const embed = new MessageEmbed()
            .setTitle(`**${capitalize(Card.name)} has appeared!**`)
            .setColor(CardManager.rarities[Card.rarity].color)
            .setDescription(`Claim it by reacting with ${emoji.real}`)
            .setImage(Card.image);
            channel.send(embed).then(message=> collection(message,Card))
        }

        const collection = (message,Card) =>
        {
            message.react(emoji.real)

            let reactedUser = ''
            const filter = (reaction,user) => {
                const filter = [emoji.id].includes(reaction.emoji.id) && user !== message.author
                if(filter)
                {
                    reactedUser = user.id
                    return true
                }
                return false

            }

            message.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(collected =>
                {
                    const reaction = collected.first();
                    const user = reaction.users.cache.find(user => user.id === reactedUser)
                    
                    if(reaction.emoji.id === emoji.id)
                    {
                        //console.log({user ,reaction})
                        
                        UserManager.User(user,(User) =>
                        {
                            //checkCards(User,Card)
                            CardManager.addCard(User, Card)
                        })
                        message.channel.send(`${user} collected the card! <a:eliLove:796554347584553010>`).then(msg => {
                            setTimeout(() => { msg.delete()}, 5000)
                        })
                        message.delete()
                        
                    }
                })
            .catch(collected=>
                {
                    message.channel.send(`No one claimed the card. <:shibaNervous:797909334607921194>`).then(msg => {
                        setTimeout(() => { msg.delete()}, 5000)
                    })
                    message.delete()
                })
        }

        CardManager.Cards(ShowDrawn)
    },
    listeningChannels:["795403419878817834"]
}