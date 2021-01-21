const UserManager = require("../../Users/UserManager")
const {Chance} = require("chance")


module.exports = {
    commands: ["coinflip","flip"],
    expectedArgs: "<amount>",
    permissionError: "You do not have required permissions",
    description: "Coinflips the coin and doubles your bet on win.",
    minArgs: 0,
    maxArgs: 1,
    requiredRoles:[],
    callBack: (message, arguments, text) => {
    let betAmount = arguments[0]
    const chance = new Chance()

    const checkBet = (User) =>
    {
        if(!betAmount)
        {
            betAmount = 50
        }
        if(betAmount == 'a' )
        {
            betAmount = Math.min(User.currency,5000)
        }
        else{
            if(betAmount < 1 || betAmount === undefined || isNaN(parseInt(betAmount))) { 
                message.channel.send("Invalid gamble amount.")
                return false
            } else {
                betAmount = parseInt(betAmount)
                if(betAmount > 5000) {
                    message.channel.send(`You can only flip **5000** coins at once!`)
                    return false;
                }
            }
        }
        if(betAmount>User.currency)
        {
            message.channel.send("You don't have enough coins!")
            return false
        }
        
        return true
    }
    

    const flipCoin = () =>
    {
        let heads = chance.bool();//50% heads or tails GRAW
        betAmount = heads ? betAmount : -betAmount

        message.channel.send(`<a:CoinToss:797288099926638632> The coin is in the air...`).then(message => {
            delayedEdit(message,
            `${heads?"<:Coin:797285459059015690>":"<:CoinBack:797285460439072778>"} The coin landed on ${heads?"**Heads**":"**Tails**"} ! You ${heads?"won":"lost"} **${Math.abs(betAmount)}** S€`,
            3000)
        })
        return betAmount
    }

    const calculate = async (User) =>
    {
        if(checkBet(User))
        {
            
            let win = flipCoin()

            if(win<0 && User.id !== "779996172793544735")
            {
                UserManager.Hana(win*-1)
            }
            User.currency += win
            
            setTimeout(() => {
                User.save();
                }, 100);
        }
    }
    UserManager.User(message.member, calculate)
    
    //if(isNaN(betAmount))return
    },
    requiredRoles: [],

}

delayedEdit = (message, newContent, delay) => {
    setTimeout(function() { message.edit(newContent) },delay)
}