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
			throw new UserException("Invalid input!")
		}
	}

	fromName(name) {
		this.actualName = name.charAt(0).toUpperCase() + name.slice(1) 
		
		let lastChar = name.slice(-1)
		let octave = 4;
		if(!isNaN(lastChar)) {
			octave = Number(lastChar);	
			name = name.slice(0,-1);
		}
		this.octave = octave;
		
		this.standardName = noteUtils.standardizeNote(name);
		this.number = noteUtils.toNumber(this.standardName);

		this.normalName = this.actualName;
		if(this.actualName.length > 2) {
			this.normalName = this.standardName;	
		}
	}

	fromNumber(actualNumber) {
		this.number = noteUtils.mod12(actualNumber);
		this.octave = (actualNumber-this.number)/12 + 4;
		let name = noteUtils.toNote(this.number);
		this.standardName = name;
		this.actualNamae = name;
		this.normalName = name;
	}

	shift(amt) {
		this.number = noteUtils.mod12(this.number+amt);
		let name = noteUtils.toNote(this.number);
		this.actualName = name;
		this.normalName = name;
		this.standardName = name;

		if(this.number+amt > 11) {
			this.octave += 1;	
		}
		else if(this.number+amt < 0) {
			this.octave -= 1;
		}
	}
}

module.exports = Note;

