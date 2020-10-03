const noteUtils = require("../notes.js");
const Note = require("../note.js");

//https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
Array.prototype.rotate = (function() {
    var push = Array.prototype.push,
        splice = Array.prototype.splice;
    return function(count) {
        var len = this.length >>> 0,
            count = count >> 0;
        count = ((count % len) + len) % len;
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

function pitchClassSet(message, args) {
	let inputNotes = args.map(name => new Note(name));
	inputNotes = noteUtils.removeDuplicates(inputNotes)
	sortNotes(inputNotes)
	inputNotes.push(inputNotes[0])

	let normalOrder = calculateNormalOrder(inputNotes);
	let retrogradeOrder = calculateRetrogradeOrder(normalOrder);
	
	let noSum = normalOrder.reduce((a,b)=>a+b)
	let roSum = retrogradeOrder.reduce((a,b)=>a+b)

	let bno = noSum < roSum ? normalOrder : retrogradeOrder;
	let notes = bno.map(num => new Note(num));	
	notes.map(note => note.shift(inputNotes[0].number))
	
	if(noSum < roSum) {
		return [displayBNO(normalOrder), notes];
	}
	else {
		return [displayBNO(retrogradeOrder), notes];
	}
}

function displayBNO(bno) {
	text = "BNO: ["
	for(let i = 0; i < bno.length-1; i++) {
		text += bno[i] + " ";
	}
	text += bno[bno.length-1] + "]"

	return text;
}

function calculateRetrogradeOrder(normalOrder) {
	let ro = [0];
	for(let i = normalOrder.length-1; i > 0; i--) {
		let interval = normalOrder[i]-normalOrder[i-1];

		prev = ro[ro.length-1];

		ro.push(prev+interval);
	}

	return ro;
}

function sortNotes(inputNotes) {
	let referenceNote = inputNotes[0]
	let distance = (note) => noteUtils.intervalBetween(referenceNote.standardName, note.standardName)
	inputNotes.sort((a, b) => {
		return distance(a) - distance(b)
	});	
}

function calculateNormalOrder(inputNotes) {
	let notes = inputNotes.map(note => note.standardName);
	let intervals = [];
	let largest = 0;
	let indexOfLargest = 0;
	for(let i = 0; i < inputNotes.length-1; i++) {
		let interval = noteUtils.intervalBetween(notes[i], notes[i+1])
		intervals.push(interval)

		if(interval > largest) {
			largest = interval;
			indexOfLargest = i;
		}
	}

	let no = [0];
	for(let i = 1; i < intervals.length; i++) {
		let currentIndex = indexOfLargest + i;
		if(currentIndex > intervals.length-1) {
			currentIndex -= intervals.length;
		}

		let currentInterval = intervals[currentIndex];
		let previous = no[i-1];

		no.push(previous + currentInterval)
	}
	
	return no;
}

module.exports = {
	name: 'pcs',
	aliases: ["pitchclassset", "bno", "bestnormalorder"],
	description: "Best normal order for a given pitch class set",
	usage: "<note> [note...]",
	example: "Ab C D#",
	args: true,
	validNotes: true,
	execute(message, args) {
		return pitchClassSet(message, args);	
	}
}
