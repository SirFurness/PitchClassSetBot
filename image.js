const Canvas = require('canvas');
const {MessageAttachment} = require('discord.js')
const noteUtils = require('./notes.js');
const Note = require('./note.js');

module.exports = async args => {
	let width = 80*args.length + 85;
	
	let normalHeight = 150;
	let height = normalHeight
	let staffTop = 0;

	let heights = args.map(note => calculateHeight(note))
	let top = Math.min(...heights.map(height => height.top));
	let bot = Math.max(...heights.map(height => height.bot));
	bot += 30
	
	if(top < 0) {
		height += -top;
		staffTop += -top;
	}
	if(bot > normalHeight) {
		height += bot-normalHeight;
	}

	let canvas = Canvas.createCanvas(width, height);	
	let ctx = canvas.getContext('2d');
	ctx.fillStyle = "white";
	ctx.fillRect(0,0, canvas.width, canvas.height);

	let noteParts = await loadNoteParts();

	ctx.drawImage(noteParts.trebleClef, 0, staffTop, 85, 170);
	ctx.drawImage(noteParts.staff, 85, staffTop, width, 170)
	
	for([i, height] of heights.entries()) {
		let xPos = 100 + 80*i
		createNote(ctx, noteParts, staffTop, xPos, args[i], height);
	}
	
	let attachment = new MessageAttachment(canvas.toBuffer(), 'notes.png');
	return attachment;
}

let switchDown = new Note("Bb");
let ledgerDown = new Note("Db");
let ledgerUp = new Note("G#5");
let stemExtendDown = new Note("Bb5")
let stemExtendUp = new Note("B#3")
let stemEndPos = new Note("B");
function createNote(ctx, parts, staffTop, xPos, note, height) {
	let notePos = 0;
	let noteDirection = ""
	if(switchDown.isAbove(note) || (switchDown.equals(note) && note.normalName === "A#")) {
		notePos = height.top+staffTop+54
		noteDirection = "down";
	}
	else {
		notePos = height.top+54+staffTop
		noteDirection = "up";
	}
	
	let xShift = 5;
	let yShift = 15;
	if(note.isAbove(ledgerUp) || (note.equals(ledgerUp) && note.normalName === "Ab")) {
		let numOfLedgers = Math.ceil((Note.noAccidentalDistance(ledgerUp, note))/2)

		for(let i = 1; i <= numOfLedgers; i++) {
			ctx.drawImage(parts.ledger, xPos+xShift, staffTop+31-19*i, 38, 5)
		}
	}
	else if(ledgerDown.isAbove(note) || (note.equals(ledgerDown) && note.normalName === "C#")) {
		let numOfLedgers = Math.ceil((Note.noAccidentalDistance(note, ledgerDown))/2)

		for(let i = 1; i <= numOfLedgers; i++) {
			ctx.drawImage(parts.ledger, xPos+xShift, staffTop+31+19*(i+4), 38, 5)
		}
	}
	
	if(noteDirection === "down") {
		ctx.drawImage(parts.down, xPos+4, height.top+staffTop, 85/2, 170/2);	
	}
	else {
		ctx.drawImage(parts.up, xPos, height.top+54+staffTop, 85/2, 170/2);
	}
	
	if(note.accidental === "b") {
		ctx.drawImage(parts.flat, xPos-25, notePos-28, 30, 60);	
	}
	else if(note.accidental === "#") {
		ctx.drawImage(parts.sharp, xPos-25, notePos-20, 30, 70);
	}

	if(note.isAbove(stemExtendDown) || (note.equals(stemExtendDown) && note.normalName === "Bb")) {
		let length = 9.5*Note.noAccidentalDistance(stemEndPos, note)-10
		ctx.drawImage(parts.stem, xPos+9, notePos+28, 5, length)	
	}
	if(stemExtendUp.isAbove(note) || (note.equals(stemExtendUp) && note.standardName === "B#")) {
		let length = 9.5*Note.noAccidentalDistance(note, stemExtendUp)+10	
		ctx.drawImage(parts.stemUp, xPos+32, height.top-length+15, 4, length)
	}
}

let middleC = new Note(0);
function calculateHeight(note) {
	let normalNote = new Note(note.normalName.slice(0, 1))
	normalNote.octave = note.octave
	if(note.normalName === "B#") {
		normalNote.octave -= 1;	
	}
	
	let distanceFromC = Note.noAccidentalDistance(middleC, note);

	let isLineNote = distanceFromC%2 === 0 ? true : false;
	
	let height = 9.5*(6-distanceFromC);
	return {top: height, bot: height+170/2, isLineNote};
}

async function loadNoteParts() {
	let staff = await Canvas.loadImage('./images/staff.png');
	let trebleClef = await Canvas.loadImage('./images/treble.png');
	let flat = await Canvas.loadImage('./images/flat.png');
	let sharp = await Canvas.loadImage('./images/sharp.png');
	let up = await Canvas.loadImage('./images/up.png');
	let down = await Canvas.loadImage('./images/down.png');
	let ledger = await Canvas.loadImage('./images/ledger.png');
	let stem = await Canvas.loadImage('./images/stem.png');
	let stemUp = await Canvas.loadImage('./images/stemUp.png');

	return {staff, trebleClef, flat, sharp, up, down, ledger, stem, stemUp}
}
