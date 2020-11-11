const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
	totalSpent: {type: Number, required: true},
	shippingAddress: {type: String, required: true},
	orderRef: {type: String, required: true},
	orderDate: {type: String, required: true},
	userId: {type: Schema.Types.ObjectId, required: true, ref: "User"}
})

module.exports = mongoose.model("Order", orderSchema);