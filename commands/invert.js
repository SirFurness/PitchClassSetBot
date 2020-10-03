const noteUtils = require('../notes.js');
const Note = require("../note.js");

function* partialSum(iter) {
	sum = 0;

	for(const x of iter) {
		sum += x;
		yield sum;
	}
}

function invert(message, args) {
	let notes = args.map(arg => new Note(arg))
	let nums = notes.map(note => note.number);
	let intervals = noteUtils.numbersToIntervals(nums);	
	let flippedIntervals = intervals.map(int => -1*int)

	let shifts = partialSum(flippedIntervals);
	
	let i = 1;
	for(shift of shifts) {
		notes[i].shift(shift*2)
		i++;
	}

	let output = notes.map(note => note.actualName).join(" ");
	return [output, notes];
}

module.exports = {
	name: "inv",
	aliases: ["invert"],
	description: "Inverts the given pitch class set",
	usage: "<pitch class set>",
	example: "Eb G# D",
	args: true,
	execute(message, args) {
		return invert(message, args);
	}
}
