const validNotes = ["A","B","C", "D", "E", "F", "G"]

const notes = [
	"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

exports.toNote = function (number) {
	return notes[number];
}

exports.getOctave = function(note) {
	if(isNaN(note.charAt(note.length-1))) {
		return 4;
	}
	else {
		return Number(note.charAt(note.length-1))
	}
}

exports.toNumber = function (note) {
	return notes.indexOf(note);
}

exports.mod12 = function(num) {
	return (num%12+12)%12;
}

exports.noteDistanceNoAccidentals = function(a, b) {
	/*let scale = a.isAbove(b) ? -1 : 1;

	console.log(`scale: ${scale}`)
	console.log("a:")
	console.log(a);
	console.log("b:")
	console.log(b)

	let octaves = Math.max(0, Math.abs(b.octave - a.octave)-1);

	let start = Math.min(a.number, b.number)
	let end = Math.max(b.number, a.number)

	console.log(`start: ${start}, end: ${end}`)

	let dist = 0;
	for(let i = start+1; i <= end; i++) {
		if(notes[i].length === 2) {
			continue;
		}
		else {
			dist += 1;
		}
	}

	if(a.number < b.number && scale === -1 ||
	   b.number < a.number && scale === 1  || 
	   (a.number === b.number && a.octave !== b.octave)) {
		dist = 7-dist	
	}

	console.log(`dist: ${dist}`)
	console.log(`total: ${scale*(dist+7*octaves)}`)

	return scale*(dist+7*octaves);*/
}

exports.intervalsToNumbers = function (intervals) {
	let numbers = [intervals[0]]
	for(let i = 1; i < intervals.length; i++) {
		numbers.push(numbers[i-1]+intervals[i])
	}
	return numbers.map(num => exports.mod12(num))
}

exports.numbersToIntervals = function (numbers) {
	let output = []
	for(let i = 1; i < numbers.length; i++) {
		output[i-1] = exports.mod12(numbers[i] - numbers[i-1])
	}
	return output;
}

exports.intervalBetween = function (a, b) {
	let interval = exports.toNumber(b)-exports.toNumber(a);
	if(interval < 0) {
		interval = 12+interval;
	}	
	return interval;
}

exports.removeDuplicates = function(notes) {
	return notes.filter((item, index, arr) =>
		index===arr.findIndex(elem => elem.standardName === item.standardName));
}

exports.isValidNote = function (note) {
	if(typeof(note) === "object" && note.constructor.name === "Note") return true;

	//a single [A-g], one or more [#b], 0 or 1 \d
	return /^[A-g][#b]*\d{0,1}$/.test(note);
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

