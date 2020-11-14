const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = Schema({
	name: {type: String, required: true},
	cardNumber: {type: String, required: true},
	expiry: {type: String, required: true},
	securityNumber: {type: String, required: true},
	userId: {type: Schema.Types.ObjectId, required: true, ref: "User"}
})

module.exports = mongoose.model("Payment", paymentSchema);