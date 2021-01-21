const UserManager = require("../../Users/UserManager")
const moment = require("moment")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["donate", "transfer", "send"],
    description: "Transfer money to Tagged User",
    expectedArgs: "<amount> <user>",
    minArgs: 2,
    maxArgs: 2,
    callBack: (message, arguments, text) => {

        if(isNaN(arguments[0]))
        {
            message.channel.send("Provide correct amount")
            return
        }
        let amount = parseInt(arguments[0])
        const member = message.mentions.members.first()
        //console.log(member)
        let transaction = true
        
        const transferFrom = (User) =>
        {
            if(User.currency<amount)
            {
                message.channel.send("You dont have enough money to send.")
                transaction = false
                return
            }
            message.channel.send(`You transfered *${amount}* S€ to ${member}.`)
            User.currency -= amount
            User.save()

        }
        const transferTo = (User) =>
        {
            if(!transaction)return
            User.currency += amount
            User.save()
        }
        UserManager.User(member, transferTo)
        UserManager.User(message.author, transferFrom)
        

    }

}

