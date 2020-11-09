const express = require("express");
const graphHTTP = require("express-graphql");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://Zubair97:superman2008@cluster0.epauj.mongodb.net/<dbname>?retryWrites=true&w=majority")
mongoose.connection.once("open", () => {
	console.log("Connected to database")
})

app.use("/graphql", graphHTTP({



}));

app.listen(4000, () => {
	console.log("Hello world")
})