const UserManager = require("../../Users/UserManager")
const CardManager = require("../../Cards/CardsManager")
const {MessageEmbed, User} = require("discord.js")
const {capitalize} = require("../../Basics/OutputEditing")


module.exports = {
    commands: ["inventory","inv"],
    description: "Show all of your cards",
    minArgs: 0,
    maxArgs: 0,
    callBack: async (message, arguments, text) => {
        
        
        //console.log(member)
        let getCards = (User) =>
        {        
            const showCards = (Cards) =>
            {

                let embed = new MessageEmbed()
                embed.setTitle(`${message.member.displayName}'s inventory`).setThumbnail(message.author.avatarURL()).setFooter("Cards provided by Serotome").setColor("#ff6e9d")
                var description = "";
                for(const card of User.cards)
                {
                    Card = Cards.find(Card => Card.id === card.id)
                    if(!Card)continue
                    if(User.cards.indexOf(card) > 0) { description += `\n` }
                    description += `・**${capitalize(Card.name)}**`
                    if(card.count > 1) { description += ` x${card.count}`}
                }
                embed.setDescription(description)
                message.channel.send(embed)
            }
            CardManager.Cards(showCards)
        }
       UserManager.User(message.author,getCards)


    }
}


returnCard = (id,amount) => {
    CardManager.Cards()
}

