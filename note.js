const noteUtils = require("./notes.js");
const UserException = require("./exception.js");

class Note {
	constructor(input) {
		if(typeof(input) === "number") {
			this.fromNumber(input);	
		}
		else if(!isNaN(input)) {
			this.fromNumber(Number(input))
		}
		else if(typeof(input) === "string") {
			this.fromName(input);
		}
		else if(typeof(input) === "object" && input.constructor.name === "Note") {
			return input;
		}
		else {
			console.log(input)
			throw new UserException("Invalid input!")
		}

		if(this.normalName === "B#") {
			this.octave += 1;
		}
	}

	fromName(name) {
		let lastChar = name.slice(-1)
		let octave = 4;
		if(!isNaN(lastChar)) {
			octave = Number(lastChar);	
			name = name.slice(0,-1);
		}
		this.octave = octave;
		
		this.actualName = name.charAt(0).toUpperCase() + name.slice(1) 
		
		this.standardName = noteUtils.standardizeNote(name);
		this.number = noteUtils.toNumber(this.standardName);

		this.normalName = this.actualName;
		if(this.actualName.length > 2) {
			this.normalName = this.standardName;	
		}

		this.accidental = this.getAccidental(this.normalName);
		this.standardAccidental = this.getAccidental(this.standardName);
	}

	fromNumber(actualNumber) {
		this.number = noteUtils.mod12(actualNumber);
		this.octave = (actualNumber-this.number)/12 + 4;
		let name = noteUtils.toNote(this.number);
		this.standardName = name;
		this.actualName = name;
		this.normalName= name;

		this.accidental = this.getAccidental(this.normalName);
		this.standardAccidental = this.getAccidental(this.standardName);
	}

	shift(amt) {
		let octaveShift = Math.floor(Math.abs(amt/12))
		if(amt < 0) {
			octaveShift *= -1;
		}
		this.octave += octaveShift;

		amt -= 12*octaveShift
		if(this.number+amt > 11) {
			this.octave += 1;	
		}
		else if(this.number+amt < 0) {
			this.octave -= 1;
			
		}
		
		this.number = noteUtils.mod12(this.number+amt);
		let name = noteUtils.toNote(this.number);
		this.actualName = name;
		this.normalName = name;
		this.standardName = name;

		this.accidental = this.getAccidental(this.normalName);
		this.standardAccidental = this.getAccidental(this.standardName);
	}

	getAccidental(name) {
		if(name.length === 1) {
			return "";
		}	
		else {
			return name.charAt(1);
		}
	}

	isAbove(note) {
		return this.octave > note.octave ||
		(this.octave === note.octave && this.number > note.number)
	}

	equals(note) {
		return this.octave === note.octave && this.number === note.number;
	}

	static noAccidentalDistance(a, b) {
		let lowerNote = new Note(a.actualName);
		lowerNote.octave = a.octave;
		let upperNote = new Note(b.actualName);
		upperNote.octave = b.octave;
		
		let scale = 1;
		if(a.isAbove(b)) {
			let temp = upperNote;
			upperNote = lowerNote;
			lowerNote = temp;
			scale = -1;
		}

		let totalShift = 0;
		if(lowerNote.accidental === "#") {
			lowerNote.shift(-1);
		}

		if(upperNote.accidental === "#") {
			upperNote.shift(-1)
		}

		while(upperNote.isAbove(lowerNote)) {
			let shift = 2;
			if(lowerNote.standardName === "B" || lowerNote.standardName === "E") {
				shift = 1;
			}

			lowerNote.shift(shift);
			totalShift += 1;
		}

		return totalShift * scale;
	}

	static halfstepsBetween(a, b) {
		let lowerNote = new Note(a.actualName);
		lowerNote.octave = a.octave;
		let upperNote = new Note(b.actualName);
		upperNote.octave = b.octave;
		
		let scale = 1;
		if(a.isAbove(b)) {
			let temp = upperNote;
			upperNote = lowerNote;
			lowerNote = temp;
			scale = -1;
		}

		let halfsteps = 0;
		while(upperNote.isAbove(lowerNote)) {
			lowerNote.shift(1);
			halfsteps += 1;
		}
		console.log(scale * halfsteps)

		return scale*halfsteps;
	}
}

module.exports = Note;
