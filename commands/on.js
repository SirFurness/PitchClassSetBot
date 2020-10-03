const noteUtils = require("../notes.js");
const Note = require("../note.js");

function startOn(message, args) {
	let notes = args.map(arg => new Note(arg));
	let startNote = notes.shift();
	let shiftAmt = startNote.number - notes[0].number;
	
	notes.forEach(note => note.shift(shiftAmt))
	
	let octave = notes[0].octave;
	notes[0] = new Note(startNote.actualName);	
	notes[0].octave = octave;
	
	let output = notes.map(note => note.actualName).join(" ");
	return [output, notes]
}

module.exports = {
	name: 'on',
	aliases: ['starton'],
	description: "Start the pitch class set on the given note",
	usage: "<note> <pitch class set>",
	example: "Eb 0 2 4 5",
	args: true,
	validNotes: true,
	execute(message, args) {
		return startOn(message, args);	
	}
}
