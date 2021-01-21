const CardManager = require("../../Cards/CardsManager")
const {MessageEmbed, User} = require("discord.js")
const UserManager = require("../../Users/UserManager")

module.exports = {
    commands: ["add"],
    expectedArgs: "<name> <rarity> <value> <image>",
    permissionError: "You do not have required permissions",
    description: "Creates a card.",
    requiredRoles: ["795403926412853260", "795403419091075118"],
    minArgs: 0,
    maxArgs: 4,
    callBack: (message, arguments, text) => {
        const {author} = message
        var newCard = ["unset",1,0,"unset"];
        const filter = m => {
            return m.author.id === message.author.id;
         }
         const filterNumber = m => {
             return(m.author.id === message.author.id && !isNaN(parseInt(m.content)))
         }
         const filterQuestion = m => {
             return(m.author.id === message.author.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no"))
         }
         const filterGive = m => {
            if(m.author.id !== message.author.id) return false
            if(m.content.toLowerCase() === "no" || m.mentions.members.first()) return true
            return false
        }
         const OGCreate = (card) => {
             card[0] = "the original "+card[0]
             card[1] = 0//Set rarity to Original
             //Save card
             CardManager.create(card)
             message.channel.send(`Okay, an **Original** rarity of **${card[0]}** has been created.\nWould you like to give it to anyone? (Mention them if yes)`).then(() => {
                message.channel.awaitMessages(filterGive, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    var mm = collected.first().content.toLowerCase();
                    if(mm === "no") {
                        message.channel.send(`Okay, the **Original** rarity card will not be given to anyone.`)
                    } else {
                        message.channel.send(`Okay the **Original** rarity card has been created and given to ${collected.first().mentions.members.first()}`)
                        //Give card to user
                        UserManager.User(collected.first().mentions.members.first(),(User) =>
                        {
                            //checkCards(User,Card)
                            const GiveNewCard = (Card) => {
                                CardManager.addCard(User, Card)
                            }
                            CardManager.Card({name: card[0]},GiveNewCard)  
                        })
                    }
                }).catch(collected => {
                    message.channel.send(`You took too long to answer, the card has been created but the original version has not been given out.`);
                });
            })
         }
         const collection = (message) =>
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
                        OGCreate(arguments)
                    }
                    else{
                        message.edit(`Original not created`)
                    }
                })
            .catch(collected=>
                {
                    message.edit(`Response Timeout`)
                })
        }
         const ContinueCreating = () => {
            message.channel.send(`Okay, the card will be called **${newCard[0]}**\nWhat rarity should it be?\n>>> 1 - Basic\n2 - Uncommon\n3 - Rare\n4 - Special\n5 - Exclusive`).then(() => {
                //Await rarity
                message.channel.awaitMessages(filterNumber, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    newCard[1] = parseInt(collected.first().content);
                    message.channel.send(`Okay, the card's rarity will be **${newCard[1]}**\nHow much will this card sell for?`).then(() => {
                        //Await sell value
                        message.channel.awaitMessages(filterNumber, { max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            newCard[2] = parseInt(collected.first().content);
                            message.channel.send(`Okay, the card will sell for **${newCard[2]} S€**\nWhat's this card's image URL?`).then(() => {
                                //Await URL
                                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                                .then(collected => {
                                    newCard[3] = collected.first().content;
                                    message.channel.send(`Okay, the **${newCard[0]}** card has been created!\n> Rarity:**${newCard[1]}**\n> Value:**${newCard[2]}**\n> URL:${newCard[3]}\nWould you like to make an **Original** version of this card?`).then(() => {
                                        //Await create original
                                        message.channel.awaitMessages(filterQuestion, { max: 1, time: 15000, errors: ['time'] })
                                        .then(collected => {
                                            switch(collected.first().content.toLowerCase()) {
                                                case "yes":
                                                    OGCreate(newCard)
                                                break;
                                                case "no":
                                                    message.channel.send(`Okay then we're done! Your card has been created!`)
                                                break;
                                            }
                                        })
                                        .catch(collected => {
                                            message.channel.send(`You took too long to answer, the card has been created but not an original version.`);
                                        });
                                    })
                                    //save card
                                    CardManager.create(newCard)
                                })
                                .catch(collected => {
                                    message.channel.send(`You took too long to answer, card creation cancelled.`);
                                });
                            })
                        })
                        .catch(collected => {
                            message.channel.send(`You took too long to answer, card creation cancelled.`);
                        });
                    })
                })
                .catch(collected => {
                    message.channel.send(`You took too long to answer, card creation cancelled.`);
                });
            })
         }
        if(arguments[3])
        {
            CardManager.create(arguments)
            message.channel.send(`Card ${arguments[0]} created`).then(collection)
            
        }
        else
        {
            if(arguments[0])
            {
                if(arguments[0].toLowerCase() === "help")
                {
                    console.log(this.expectedArgs)
                    message.channel.send(`adding cards: add <name> <rarity> <value> <image>`)
                    return
                }
            }
            message.channel.send(`Okay, lets create a card! <:AYAYA:797909332179943425>\nFirstly, what would you like to name it?`).then(() => {           
                //Await Name
                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    newCard[0] = collected.first().content.toLowerCase();
                    CardManager.Card({name: newCard[0]},(ret) => {
                        if(ret === 1) {
                            ContinueCreating()
                        } else {
                            message.channel.send(`A card with that name already exists!`)
                        }
                    })
                })
                .catch(collected => {
                    message.channel.send(`You took too long to answer, card creation cancelled.`);
                });
                })
        }
    }

}