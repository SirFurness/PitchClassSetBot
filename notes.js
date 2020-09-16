const validNotes = ["A","B","C", "D", "E", "F", "G"]

const notes = [
	"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

exports.toNote = function (number) {
	return notes[number];
}
exports.toNumber = function (note) {
	return notes.indexOf(note);
}

exports.intervalsToNumbers = function (intervals) {
	let numbers = [intervals[0]]
	for(let i = 1; i < intervals.length; i++) {
		numbers.push(numbers[i-1]+intervals[i])
	}
	return numbers.map(num => (num%12+12)%12)
}

exports.intervalBetween = function (a, b) {
	let interval = exports.toNumber(b)-exports.toNumber(a);
	if(interval < 0) {
		interval = 12+interval;
	}	
	return interval;
}

exports.removeDuplicates = function (notes) {
	return [...new Set(notes)];
}

exports.isValidNote = function (note) {
	firstCharValid = validNotes.includes(note.charAt(0).toUpperCase());
	restOfChar = note.slice(1);

	let restOfCharValid = /^[#b]*$/.test(restOfChar);

	return firstCharValid && restOfCharValid;
}

exports.signedIntervalBetween = function (a, b) {
	let interval = exports.toNumber(b)-exports.toNumber(a);
	return interval;
}

exports.standardizeNotes = function (inputNotes) {
	return inputNotes.map(note => exports.standardizeNote(note))	
}
exports.standardizeNote = function (note) {
	if(note.length === 1) {
		return note.toUpperCase();
	}
	
	let noteName = note.charAt(0).toUpperCase();
	let rest = note.slice(1).split('');

	let sum = rest.map(a => {
		if(a === "b") {
			return -1;
		}
		else if(a === "#") {
			return 1;
		}
	}).reduce((a,b)=>a+b)

	let newNote = exports.toNumber(noteName)+sum
	if(newNote < 0) {
		newNote += 12;
	}
	if(newNote >= 12) {
		newNote -= 12;
	}
	
	return exports.toNote(newNote);
}

