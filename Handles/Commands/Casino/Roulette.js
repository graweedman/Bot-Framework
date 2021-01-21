const UserManager = require("../../Users/UserManager")
const {Chance} = require("chance")


module.exports = {
    commands: ["roulette", "spin"],
    expectedArgs: "<bettype> <amount>",
    permissionError: "You do not have required permissions",
    description: "Coinflips the coin and doubles your bet on win.",
    requiredRoles:[],
    minArgs: 0,
    maxArgs: 2,
    callBack: (message, arguments, text) => {
    let betAmount = arguments[1]
    const chance = new Chance()
    console.log(betAmount)
    const checkBet = (User) =>
    {
        if(!betAmount)
        {
            betAmount = 50
        }
        if(betAmount == 'a' )
        {
            betAmount = User.currency
        }
        else{
            if(betAmount < 1 || betAmount === undefined || isNaN(parseInt(betAmount))) { 
                message.channel.send("Invalid gamble amount.")
                return false
            } else {
                betAmount = parseInt(betAmount)
            }
        }
        if(betAmount>User.currency)
        {
            message.channel.send("You don't have enough coins!")
            return false
        }
        
        return true
    }
    
    let betMethod= arguments[0]
    const roulette = () =>
    {
        var winningNumber = chance.integer({ min: 0, max: 36 });
    var moneyReturn = -betAmount
    var toSend = `${message.author}, You bet **${betAmount}** S€ `
    switch(betMethod) {
        case "even":
            toSend += `**even numbers**.`
            if(winningNumber%2 === 0) { //is even, won
                moneyReturn = betAmount;
            }
        break;
        case "odd":
            toSend += `**odd numbers**.`
            if(winningNumber%2 !== 0) { //is odd, won
                moneyReturn = betAmount;
            }
        break;
        case "red":
            toSend += `**red numbers**.`    
            var redNumbers = [3,9,12,18,21,27,30,36,5,14,23,32,1,7,16,19,25,34]
            if(redNumbers.indexOf(winningNumber) !== -1) { //is a red number so win
                moneyReturn = betAmount;
            }
        break;
        case "black":
            toSend += `**black numbers**.`    
            var redNumbers = [3,9,12,18,21,27,30,36,5,14,23,32,1,7,16,19,25,34]
            if(redNumbers.indexOf(winningNumber) === -1 && winningNumber !== 0) { //is a black number win
                moneyReturn = betAmount;
            }
        break;
        case "f12":
            toSend += `**first dozen** ***(1-12)***.`
            if(fromTo(1,12, winningNumber)) { //is 1-12 so win
                moneyReturn = betAmount*2;
            }
        break;
        case "s12":
            toSend += `**second dozen** ***(13-24)***.`
            if(fromTo(13,24, winningNumber)) { //is 13-24 so win
                moneyReturn = betAmount*2;
            }
        break;
        case "t12":
            toSend += `**third dozen** ***(25-36)***.`
            if(fromTo(25,36, winningNumber)) { //is 25-36 so win
                moneyReturn = betAmount*2;
            }
        break;
        case "low":
            toSend += `**low numbers** ***(1-18)***.`
            if(fromTo(1,18, winningNumber)) { //is 1-18 so win
                moneyReturn = betAmount;
            }
        break;
        case "high":
            toSend += `**high numbers** ***(19-36)***.`
            if(fromTo(19,36, winningNumber)) { //is 19-36 so win
                moneyReturn = betAmount;
            }
        break;
        default: //numbers or invalid
            if(betMethod !== undefined) {
                if(betMethod.includes("/")) {
                    var betNumbers = []
                    var betMethods = betMethod.split("/");
                    toSend += "the numbers: **"
                    //I already fixed that boo
                    for(i=0; i<betMethods.length; i++) {
                        if(betMethods[i] !== undefined && betMethods[i] !== "") {
                            var ThisNum = parseInt(betMethods[i])
                            if(fromTo(1,36,ThisNum) && betNumbers.indexOf(ThisNum) === -1) {
                                betNumbers.push(ThisNum);
                            }
                        }
                    }

                    console.log(betNumbers)
                    betNumbers.forEach( (value,index) =>
                    {
                        toSend += value
                        
                        if(betNumbers.length > 2) {
                            if(index === betNumbers.length-2) { //explain this <---------------------------------------------------------------- :IrIangy:
                                toSend += ", and "
                            }
                            if(index < betNumbers.length-2) {
                                toSend += ", "
                            }
                        } else {
                            if(index === 0 && betNumbers.length === 2) {
                                toSend += " and "
                            }
                        }
                    }
                    )
                    // for(i=0; i<betNumbers.length; i++) { //repeat the loop just for the display name (can't use the first one cuz it'll fuck up if the person puts in useless slashes)
                    //     toSend += betNumbers[i]
                    //     if(i < betNumbers.length-1 && betNumbers.length > 2) {
                    //         toSend += ", "
                    //     }
                    //     if(i === betNumbers.length-2 && betNumbers.length > 2) {
                    //         toSend += ", and "
                    //     }
                    //     if(i=0 && betNumbers.length === 2) {
                    //         toSend += " and "
                    //     }
                    // }
                    toSend += "**"
                    if(!(fromTo(1,4,betNumbers.length) || betNumbers.length === 6)) {
                        moneyReturn = 0
                        message.channel.send("Invalid number of bets.")
                        return;
                    }
                    if(betNumbers.indexOf(winningNumber) !== -1) { 
                        switch(betNumbers.length) {
                            case 1:
                                moneyReturn = betAmount*35
                            break;
                            case 2:
                                moneyReturn = betAmount*16
                            break;
                            case 3:
                                moneyReturn = betAmount*10
                            break;
                            case 4:
                                moneyReturn = betAmount*8
                            break;
                            case 6:
                                moneyReturn = betAmount*4
                            break;
                        }
                    }
                } else {
                    toSend += `the number: **${betMethod}**`;
                    if(winningNumber === parseInt(betMethod)) {
                        moneyReturn = betAmount*35;
                    }
                }
            } else {
                moneyReturn = 0
                message.channel.send("Invalid type of bet.")
                return;
            }
        break;
    }

    var premessage = "\n\n<a:roulette:797240390000312321> **The roulette is spinning...**\n:white_circle: The marble shows **"
    var randomNumberArray = []
    for(var i=0; i<4; i++) {
        randomNumberArray[i] = rouletteNumber(chance.integer({ min: 0, max: 36 }));
    }
    var finalSend = `\n\n<:rouletteStill:797241398386229268> **The roulette has stopped...**\n:white_circle: Marble lands on **${rouletteNumber(winningNumber)}**.\nYou lost...`
    if(moneyReturn > 0) {
        finalSend = `\n\n<:rouletteStill:797241398386229268> **The roulette has stopped...**\n:white_circle: Marble lands on **${rouletteNumber(winningNumber)}**.\nYou won **${moneyReturn}** S€!`
    }//shouldnt it check before sening message? it is stupi
    message.channel.send(`${toSend}${premessage}${randomNumberArray[0]}**...`).then(toEdit => {
        delayedEdit(toEdit,`${toSend}${premessage}${randomNumberArray[1]}**.`,1000)
        delayedEdit(toEdit,`${toSend}${premessage}${randomNumberArray[2]}**..`,2000)
        delayedEdit(toEdit,`${toSend}${premessage}${randomNumberArray[3]}**...`,3000)
        delayedEdit(toEdit,`${toSend}${finalSend}`,4000)})
        return moneyReturn
    }

    const calculate = async (User) =>
    {
        if(checkBet(User))
        {
            let win = roulette()

            if(win<0 && User.id !== "779996172793544735")
            {
                UserManager.Hana(win*-1)
            }
            User.currency += parseInt(win)
            
            
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
victoryMessage = (amount) => {
    return `You ${(amount < 0) ? "lost": "won"} **${Math.abs(amount)}** S€`
}
rouletteNumber = (number) => {
    if(number === 0) {
        return number+" :green_square:"
    }
    var redNumbers = [3,9,12,18,21,27,30,36,5,14,23,32,1,7,16,19,25,34]
    if(redNumbers.indexOf(number) !== -1) {
        return number+" :red_square:"
    } else {
        return number+" :black_large_square:"
    }
}
fromTo = (min,max, winningNumber) =>
{
    if(winningNumber >= min && winningNumber <= max) { //is 1-12 so win
        return true
    } else {
        return false
    }
}