const noteUtils = require("../notes.js");

function pitchClassSet(message, args) {
	let inputNotes = noteUtils.standardizeNotes(args);
	inputNotes = noteUtils.removeDuplicates(inputNotes)
	sortNotes(inputNotes)	
	inputNotes.push(inputNotes[0])

	normalOrder = calculateNormalOrder(inputNotes);
	reverseOrder = calculateReverseOrder(normalOrder);
	
	noSum = normalOrder.reduce((a,b)=>a+b)
	roSum = reverseOrder.reduce((a,b)=>a+b)

	if(noSum < roSum) {
		return [displayBNO(normalOrder), normalOrder.join(" ")];
	}
	else {
		return [displayBNO(reverseOrder), reverseOrder.join(" ")];
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

function calculateReverseOrder(normalOrder) {
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
	let distance = (note) => noteUtils.intervalBetween(referenceNote, note)
	inputNotes.sort((a, b) => {
		return distance(a) - distance(b)
	});	
}

function calculateNormalOrder(inputNotes) {
	let intervals = [];
	let largest = 0;
	let indexOfLargest = 0;
	for(let i = 0; i < inputNotes.length-1; i++) {
		let interval = noteUtils.intervalBetween(inputNotes[i], inputNotes[i+1])
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
		let output = pitchClassSet(message, args);	
		console.log(output);
		return output;
	}
}
