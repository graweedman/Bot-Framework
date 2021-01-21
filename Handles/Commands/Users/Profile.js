const UserManager = require("../../Users/UserManager")
const moment = require("moment")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["profile", "p","user"],
    expectedArgs: "none or <User1>",
    permissionError: "You do not have required permissions",
    description: "Shows profile",
    minArgs: 0,
    maxArgs: 1,
    callBack: (message, arguments, text) => {

        let member = message.member
        if(message.mentions.members.first())
        {
            //console.log(message.mentions.members.first())
            member = message.mentions.members.first()
        }
        //console.log(member)
        const showProfile = (User) =>
        {
            console.log("works")
            const embed = new MessageEmbed()
            embed.setColor("#ff6e9d")
            embed.setTitle(`${member.user.username} Profile`)
            embed.setThumbnail(member.user.avatarURL())
            embed.addField(`Currency`,`${User.currency}`)
            embed.addField(`Daily`, `${moment().to(moment(User.daily).add(1,'d'))}`)
            embed.addField(`Match`,`${(User.matchMaker.match === "" )? "inactive": "active"}`)
            embed.addField(`Match Tokens`, `${User.matchMaker.token}/${User.matchMaker.maxTokens} ${(User.matchMaker.token < User.matchMaker.maxTokens) ? "remaining": "full"}` )
            embed.setDescription(`UwU`)
            message.channel.send(embed)
        }

       UserManager.User(member.user,showProfile)
        

    }

}

