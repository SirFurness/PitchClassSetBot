const { prefix } = require('../config.json');

function help(message, args) {
	let data = []
	const { commands } = message.client;
	
	if(args.length === 0) {
		data.push(`Use \`${prefix}help [command name]\` to get info on a specific command.`);
		data.push("Here's a list of all the commands:")	;
		data.push(commands.map(command => command.name).join(', '));

		return message.author.send(data, {split: true})
			.then(() => {
				if(message.channel.type === 'dm') return;

				message.reply('I sent you a DM with all the commands.');
			})
			.catch(error => {
				console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply("It seems like I can't DM you.")
			})
	}	

	const name = args[0].toLowerCase();
	const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

	if(!command) {
		message.reply("Invalid command");
	}

	data.push(`\n**Name:** ${command.name}`);
	
	if(command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
	if(command.description) data.push(`**Description:** ${command.description}`);
	if(command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
	if(command.example) data.push(`**Example:** ${prefix}${command.name} ${command.example}`);

	message.reply(data, {split: true})
}

module.exports = {
	name: 'help',
	description: 'List all of the commands or get info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(message, args) {
		help(message, args);
		return ["", ""];
	}
}
