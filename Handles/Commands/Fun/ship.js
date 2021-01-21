const { Chance } = require("chance");
const { RichPresenceAssets } = require("discord.js");

module.exports = {
    commands: ["ship", "relationship","sh"],
    expectedArgs: "<User1> or <User1> <User2>",
    permissionError: "You do not have required permissions",
    description: "Ships you with tagged user or ships both tagged users",
    minArgs: 1,
    maxArgs: 2,
    callBack: (message, arguments, text) => {
        //let chance = new Chance(message.author.id)
        //let chance1 = new Chance(arguments[0])
        let you = message.member.displayName;
        let other = arguments[0]
        //console.log(arguments.length)
        let userid = parseInt(message.author.id)
        let userid1 = arguments[0]
        if(arguments.length < 2)
        {
            //console.log('hello')
            userid = parseInt(message.author.id)
            if(!message.mentions.members.first())return
            userid1 = parseInt(message.mentions.members.first().id)
            other = message.mentions.members.first().displayName
        }else{
            let user1 = getUserFromMention(arguments[0],message.client,message.guild)
            let user2 = getUserFromMention(arguments[1],message.client,message.guild)

            

            if(!user1) userid = arguments[0]
            if(!user2) userid1 = arguments[1]

            userid = parseInt(user1.id)
            userid1 = parseInt(user2.id)

            you = user1.displayName
            other = user2.displayName

        }
            
        const delta = userid1+userid
        chance = new Chance(delta)
            //console.log(percentage)
        percentage = chance.random() % 100

        const U1KeyNames = smartSplitName(you)
        const U2KeyNames = smartSplitName(other)
        let shipName = "";
        if(U1KeyNames.length > 1) {
            for(var i=0; i<=Math.floor(U1KeyNames.length/2)-1; i++) { //Take the beginning keywords and add them to the ship name for user 1
                shipName += U1KeyNames[i];
            }
        } else {
            shipName += U1KeyNames[0].slice(0,U1KeyNames[0].length/2)
        }
        if(U2KeyNames.length > 1) {
            for(var i=Math.ceil(U2KeyNames.length/2); i<U2KeyNames.length; i++) { //Take the end keywords and add them to the ship name for user 2
                shipName += U2KeyNames[i];
            }
        } else {
            shipName += U2KeyNames[0].slice(U2KeyNames[0].length/2)
        }
        
        let barText = "<:Heart:797301635113025566> "
        for(var i=0; i<10; i++) {
            if(i*10 <= percentage*100) {
                barText += ":red_square:"
            } else {
                barText += ":black_large_square:"
            }
        }
        var titlelng = `${shipName}  ${Math.floor(percentage*100)}% Compatible`.length;
        var split = "━".repeat(30-titlelng);
        
        message.channel.send(`**${shipName}** ${split} **${Math.floor(percentage*100)}%** Compatible\n${barText}`)

    },
    requiredRoles: [],

}

smartSplitName = (name) => {
    let SplitCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ -_' //couldn't figure out regexs so I just did this. Change it if you think u know a faster way xD

    var processingName = ""
    var processedName = []
    for(var i=name.length-1; i>=0; i--) { //loop through each character in the user's name
        let currentChr = name.charAt(i);
        processingName = currentChr+processingName
        if(SplitCharacters.indexOf(currentChr) !== -1) { //if the character is a key character, add the portion to the name
            processedName.unshift(processingName) //add the current name to the list of name bits
            processingName = "" //clear the processing name
        }
    }
    if(processingName !== "") {
        processedName.unshift(processingName) //add the rest of the unprocessed name if any
    }
    
    return processedName;
}  

getUserFromMention = (mention,client,guild) => {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return guild.members.cache.get(mention);
	}
}