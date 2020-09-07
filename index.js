const {prefix, token} = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
})

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if(command === "pcs") {
		pitchClassSet(message, args);
	}
})

client.login(token)

let validNotes = ["A","B","C", "D", "E", "F", "G"]
let accidentals = ["b", "#"];

let notes = [
	"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

function pitchClassSet(message, args) {
	if(args.length === 0) {
		message.reply("Need to give me notes! e.g. \`!pcs Ab C D#\`");
	}
	else if(!args.every(isValidNote)) {
		message.reply("Invalid note given!")	
	}
	else {
		let inputNotes = convertFlatsToSharps(args);
		inputNotes = removeDuplicates(inputNotes)
		sortNotes(inputNotes)	
		inputNotes.push(inputNotes[0])

		normalOrder = calculateNormalOrder(inputNotes);
		reverseOrder = calculateReverseOrder(normalOrder);
		
		noSum = normalOrder.reduce((a,b)=>a+b)
		roSum = reverseOrder.reduce((a,b)=>a+b)

		if(noSum < roSum) {
			message.reply(displayBNO(normalOrder));
		}
		else {
			message.reply(displayBNO(reverseOrder));
		}
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
	let distance = (note) => intervalBetween(referenceNote, note)
	inputNotes.sort((a, b) => {
		return distance(a) - distance(b)
	});	
}

function calculateNormalOrder(inputNotes) {
	let intervals = [];
	let largest = 0;
	let indexOfLargest = 0;
	for(let i = 0; i < inputNotes.length-1; i++) {
		let interval = intervalBetween(inputNotes[i], inputNotes[i+1])
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

function isValidNote(note) {
	firstCharValid = validNotes.includes(note.charAt(0).toUpperCase());
	restOfChar = note.slice(1);

	let restOfCharValid = /^[#b]*$/.test(restOfChar);

	return firstCharValid && restOfCharValid;
}

function removeDuplicates(notes) {
	return [...new Set(notes)]
}

function convertFlatsToSharps(inputNotes) {
	return inputNotes.map(note => {
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

		let newNote = notes.indexOf(noteName)+sum
		if(newNote < 0) {
			newNote += 12;
		}
		if(newNote > 12) {
			newNote -= 12;
		}
		
		return notes[newNote];
	})
}

function intervalBetween(a, b) {
	let interval = notes.indexOf(b)-notes.indexOf(a);
	if(interval < 0) {
		interval = 12+interval;
	}	
	return interval;
}

