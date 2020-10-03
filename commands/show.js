const noteUtils = require('../notes.js');
const createImageAttachment = require('../image.js');
const Note = require("../Note.js");

async function show(message, args) {
	let notes = args.map(arg => new Note(arg))
	let attachment = await createImageAttachment(notes);
	message.reply(attachment);
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
