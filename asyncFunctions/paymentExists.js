const bcrypt = require("bcrypt")


async function paymentMatch(dataArray, cardNumber){
	let booleanArray = []

	for (const user of dataArray){
		let match = await bcrypt.compare(cardNumber, user.cardNumber)
		switch(match){
			case true:
				// card number found
				booleanArray.push(true)
			break;
			case false:
				// card number does not exist
				booleanArray.push(false)
			break;
		}
	}

	console.log("done")

	return booleanArray;


}

module.exports = {paymentMatch}