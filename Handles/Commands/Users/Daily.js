const UserManager = require("../../Users/UserManager")
const moment = require("moment")
const {MessageEmbed, User} = require("discord.js")

module.exports = {
    commands: ["daily"],
    description: "Collect daily",
    minArgs: 0,
    maxArgs: 0,
    callBack: (message, arguments, text) => {

        //console.log(member)
        const getDaily = (User) =>
        {            
            let multiplier = 1
            if(User.dailyM)
            {
                multiplier = User.dailyM
            }

            if(moment().isAfter(moment(User.daily).add(1,"d")))
            {
                const daily = 50*multiplier
                const PreviousDaily = moment(User.daily)
                const Daily = moment()
                console.log(Daily.diff(PreviousDaily, "d", true))
                User.currency += daily
                User.daily = Daily.format()
                message.channel.send(`Daily collected. **${User.dailyM}** day streak. **${daily}** S€ rolled into your account.`)
                if(Daily.diff(PreviousDaily, "d", true) < 2)
                {
                    User.dailyM += 1
                }
                else
                {
                    User.dailyM = 1
                }
                setTimeout(()=>{
                    User.save()
                },100)
                
                return
            }
            message.channel.send(`Daily isnt ready yet. Try again ${moment().to(moment(User.daily).add(1,"d"))}`)

            
        }

       UserManager.User(message.author,getDaily)
        

    }

}

