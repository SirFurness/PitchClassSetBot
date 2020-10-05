const noteUtils = require("../notes.js");
const Note = require("../note.js");

function startOn(message, args) {
	console.log("here")
	let notes = args.map(arg => new Note(arg));
	let startNote = notes.shift();
	let shiftAmt = Note.halfstepsBetween(notes[0], startNote)
	
	console.log(`shiftAmt: ${shiftAmt}`)
	notes.forEach(note => note.shift(shiftAmt))
	console.log(notes)
	
	notes[0] = startNote;
	
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
