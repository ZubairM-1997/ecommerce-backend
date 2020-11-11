const express = require("express");
const app = express();
const graphHTTP = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const {mergeSchemas} = require("graphql-tools");

const userQueries = require("./schema/queries/userQueries");
const orderQueries = require("./schema/queries/orderQueries");
const paymentMethodQueries = require("./schema/queries/paymentMethodQueries");
const personalDataQueries = require("./schema/queries/personalDetailsQueries");
const itemQueries = require("./schema/queries/itemQueries");



mongoose.connect("mongodb+srv://Zubair97:superman2008@cluster0.epauj.mongodb.net/<dbname>?retryWrites=true&w=majority")
mongoose.connection.once("open", () => {
	console.log("Connected to database")
})

const combined = mergeSchemas({
	schemas: [
		userQueries,
		orderQueries,
		paymentMethodQueries,
		personalDataQueries,
		itemQueries
	]
})

app.use("/graphql", graphHTTP({
	schema: combined,
	graphiql: true
}));

app.listen(3000, () => {
	console.log("Hello world")
})