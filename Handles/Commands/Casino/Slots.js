const UserManager = require("../../Users/UserManager")
const {Chance} = require("chance")


module.exports = {
    commands: ["slots", "roll"],
    expectedArgs: "<amount>",
    permissionError: "You do not have required permissions",
    description: "Coinflips the coin and doubles your bet on win.",
    requiredRoles:[],
    minArgs: 0,
    maxArgs: 1,
    callBack: (message, arguments, text) => {
    let betAmount = arguments[0]
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
    

    const Slots = () =>
    {
        var spinningEmote = "<a:Slots:797307129781420034> ";
        var victoryEmotes = ["<:DVA:797301634547712011>","<:Heart:797301635113025566>","<:Fire:797301633364394005>","<:Water:797306016022265856>"]
        var winningEmote = -1; //-1 for if lost
        var victoryIndex = 1;
        var WinChance = chance.integer({ min: 0, max: 100 });
        var AwaitMessage = `${message.author}, You bet **${betAmount}** S€` 
        //var VictoryMessage = `` 
        if(WinChance <= 1) {
            winningEmote = victoryEmotes[0];
            betAmount = betAmount*10;
            victoryIndex = 5;
        } else if(WinChance <= 4) {
            winningEmote = victoryEmotes[1];
            betAmount = betAmount*5;
            victoryIndex = 4;
        } else if(WinChance <= 14) {
            winningEmote = victoryEmotes[2];
            betAmount = betAmount*3;
            victoryIndex = 3;
        } else if(WinChance <= 34) {
            winningEmote = victoryEmotes[3]; //25% to get double your bet
            betAmount = betAmount;
            victoryIndex = 2;
        } else {
            //lost
            betAmount = -betAmount;
        }

        var EmoteList = [":watermelon:",":watermelon:",":watermelon:"] //watermelons for errors, these should never show up xD
        if(winningEmote === -1) { //failure
            var isSuspenseful = chance.bool({ likelihood: 75 }) //true or false deciding if it'll wait till the last block to fail (to generate suspense) :ZeroWow:
            if(isSuspenseful) {
                let AlmostVictoryEmote = victoryEmotes[chance.natural({ min: 0, max: 3 })]
                EmoteList[0] = AlmostVictoryEmote
                EmoteList[1] = AlmostVictoryEmote
                let RandomLastEmote = victoryEmotes.filter(e => e !== AlmostVictoryEmote); //pretty sure this is where the problem is but idk why it's not working :c // seems too complicated xD
                EmoteList[2] = RandomLastEmote[chance.natural({ min: 0, max: RandomLastEmote.length-1 })] //remove the victory emote from the list so it cannot be an accidental victory
            } else { 
                var AllowedEmotes = victoryEmotes;
                for(var i =0; i<3; i++) { //3 random emotes that will not be the same
                    EmoteList[i] = AllowedEmotes[chance.natural({ min: 0, max: AllowedEmotes.length-1 })]
                    AllowedEmotes = AllowedEmotes.filter(e => e !== EmoteList[i]);
                }
            }
        } else { //Won
            for(var i =0; i<3; i++) { //3 same emotes cuz win
                EmoteList[i] = winningEmote
            }
        }
        message.channel.send(AwaitMessage+"\n"+createSlotMachine(spinningEmote,spinningEmote,spinningEmote,0)).then( toEdit => {
            delayedEdit(toEdit,AwaitMessage+"\n"+createSlotMachine(EmoteList[0],spinningEmote,spinningEmote,0),2000)
            delayedEdit(toEdit,AwaitMessage+"\n"+createSlotMachine(EmoteList[0],EmoteList[1],spinningEmote,0),4000)
            delayedEdit(toEdit,AwaitMessage+"\n"+createSlotMachine(EmoteList[0],EmoteList[1],EmoteList[2],victoryIndex)+"\n"+victoryMessage(betAmount),6000)
        })
        return betAmount
    }
    
    const calculate = async (User) =>
    {
        if(checkBet(User))
        {
            let win = Slots()
            
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

var createSlotMachine = function(Slot1,Slot2,Slot3,displayText) {
    var textOptions = ["--------------","∙∙∙∙∙LOST∙∙∙∙∙","∙∙∙∙∙∙∙X1∙∙∙∙∙∙∙","∙∙∙∙∙∙∙X3∙∙∙∙∙∙∙","∙∙∙∙∙∙∙X5∙∙∙∙∙∙∙","∙∙∙∙∙∙X10∙∙∙∙∙∙"] //this could be smarter but I'm lazy
    return `▛•⌔❧⌔☙⌔•▜\n❚  ${Slot1}|${Slot2}|${Slot3}  ❚:round_pushpin:\n▌${textOptions[displayText]}▐ ⌋\n▙▄▟ <:DVA:797301634547712011> ▙▄▟`
}
delayedEdit = (message, newContent, delay) => {
    setTimeout(function() { message.edit(newContent) },delay)
}
victoryMessage = (amount) => {
    return `You ${(amount < 0) ? "lost": "won"} **${Math.abs(amount)}** S€`
}