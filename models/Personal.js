const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personalSchema = Schema({
	address: {type: String, required: true},
	country: {type: String, required: true},
	phone: {type: String, required: true},
	userId: {type: Schema.Types.ObjectId, required: true, ref: "User"}
})

module.exports = mongoose.model("Personal", personalSchema)