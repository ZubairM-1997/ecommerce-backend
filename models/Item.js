const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const itemSchema = Schema({
	title: {type: String, required: true},
	price: {type: Number, required: true},
	category: {type: String, required: true},
	description: {type: String, required: true},
	img: {type: String, required: true},
	quantity: {type: Number, required: true},
	orderId: {type: Schema.Types.ObjectId, required: true, ref: "Order"}

})

module.exports = mongoose.model("Item", itemSchema);