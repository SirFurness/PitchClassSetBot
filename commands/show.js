const noteUtils = require('../notes.js');
const createImageAttachment = require('../image.js');

async function show(message, args) {
	if(args.every(n => !isNaN(n))) {
		let attachment = await createImageAttachment(args);
		message.reply(attachment);
	}
	else if(args.every(noteUtils.isValidNote)) {
		let notes = noteUtils.standardizeNotes(args);
		let numbers = notes.map(note => noteUtils.toNumber(note));
		let attachment = await createImageAttachment(numbers);
		message.reply(attachment)
	}
	else {
		message.reply("Sorry, I don't know how to show this.");
	}
}

module.exports = {
	name: 'show',
	description: "Display the given notes",
	usage: "<number/note> [number/note...]",
	example: "Ab C D#",
	args: true,
	execute(message, args) {
		show(message, args);	
		return ["", args.join(" ")]
	}
}
