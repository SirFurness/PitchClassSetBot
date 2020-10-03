const {prefix, token} = require('./config.json')
const fs = require('fs');
const Discord = require('discord.js')
const client = new Discord.Client();
const noteUtils = require("./notes.js");
const UserException = require("./exception.js");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
})

client.on('message', message => {
	try {
		let reply = handleMessage(message);
		if(reply[0] !== "") {
			message.reply(reply[0]);	
		}	
	} catch(e) {
		if(e.name === "UserException") {
			message.reply(e.message);
		}	
		else {
			console.log(e);
		}
	}
});

function handleMessage(message) {
	if(!message.content.startsWith(prefix) || message.author.bot) return ["", message.content];

	let args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;
	
	args = evaluateArgs(message, args);

	if(command.args && args.length === 0) {
		let reply = "Need to give me stuff!";

		if(command.usage) {
			reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\`` 
		}
		if(command.example) {
			reply += `\nExample: \`${prefix}${command.name} ${command.example}\``
		}

		throw new UserException(reply)
	}
	if(command.validNotes && !args.every(noteUtils.isValidNote)) {
		throw new UserException("Invalid note given!");
	}
	
	try {
		return command.execute(message, args);
	} catch(error) {
		console.error(error);
		throw new UserException("An error occurred while executing that command.");
	}
}

function evaluateArgs(message, args) {
	if(args.every(arg => arg === "")) return [];

	let newArgs = [];

	let addArg = (arg) => {
		if(Array.isArray(arg)) {
			newArgs = newArgs.concat(arg);
		}
		else {
			newArgs.push(arg);
		}
	}
	
	for(let i = 0; i < args.length; i++) {
		let arg = args[i];
		if(arg.includes("!")) {
			if(arg.charAt(0) === "!") {
				let newContent = args.slice(i).join(" ");
				message.content = newContent;
				let response = handleMessage(message);
				if(response === undefined) {
					throw new UserException(`Invalid command: \`${arg}\``)
				}
				addArg(response[1])
				break;
			}
			else if(arg.charAt(0) === "(") {
				let endIndex = i;
				let foundCloseParenthesis = false;
				for(let j = i; j < args.length; j++) {
					if(args[j].charAt(args[j].length-1) === ")") {
						endIndex = j;	
						foundCloseParenthesis = true;
						break;
					}
				}	

				if(!foundCloseParenthesis) {
					throw new UserException("Missing closing parenthesis!")
				}

				args[i] = args[i].slice(1);
				args[endIndex] = args[endIndex].slice(0, args[endIndex].length-1);

				let newContent = args.slice(i, endIndex+1).join(" ");
				message.content = newContent;
				let response = handleMessage(message);
				if(response === undefined) {
					throw new UserException(`Invalid command: \`${arg}\``)
				}
				addArg(response[1])
				i = endIndex;
			}
		}
		else {
			addArg(arg)
		}
	}
	return newArgs;
}

client.login(token)
