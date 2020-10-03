const pcs = require("../../commands/pcs.js");

test('it calculates the BNO', () => {
	expect(pcs.execute({},['a','bb'])[0]).toBe("BNO: [0 1]")	
})
