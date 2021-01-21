const UserManager = require("../../Users/UserManager")

module.exports = {
    commands: ["setmoney", "setcoins","smoney", "scoins"],
    expectedArgs: "<user> <amount>",
    permissionError: "You do not have required permissions",
    description: "Sets a user's currency.",
    requiredRoles:["795403926412853260","795403419091075118"],
    minArgs: 2,
    maxArgs: 2,
    callBack: (message, arguments, text) => {
    let betAmount = arguments[1]
    
    let user = message.mentions.members.first();
    if(!user || user === undefined) {
        message.channel.send(`Invalid user.`)
        return
    }
    
    if(betAmount < 0 || betAmount === undefined || isNaN(parseInt(betAmount))) { 
        message.channel.send("Invalid coin amount.")
        return 
    } else {
        betAmount = parseInt(betAmount)
    }
    
    const calculate = (User) =>
    {
        User.currency = betAmount 
        User.save()
    }
    UserManager.User(user, calculate)

    message.channel.send(`Okay ${message.author}, ${user}'s currency has been set to ${betAmount}`)
    }
    
}