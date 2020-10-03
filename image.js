const Canvas = require('canvas');
const {MessageAttachment} = require('discord.js')

module.exports = async args => {
	let canvas = Canvas.createCanvas(80*args.length+85, 170);	
	let ctx = canvas.getContext('2d');

	let trebleClef = await Canvas.loadImage('./images/treble.png');
	ctx.drawImage(trebleClef, 0, 0, 85, 170);
	
	for(let i = 0; i < args.length; i++) {
		let note = await Canvas.loadImage(`./images/${args[i].number.toString()}.png`)
		ctx.drawImage(note, 80*i + 85, 0, 80, 170);
	}
	
	let attachment = new MessageAttachment(canvas.toBuffer(), 'notes.png');
	return attachment;
}
