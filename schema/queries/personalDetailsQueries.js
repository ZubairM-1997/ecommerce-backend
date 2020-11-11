const graphql = require("graphql");
const sanitize = require("mongo-sanitize");

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLSchema} = graphql;

const {PersonalDataType} = require("../typeDefinitions")
const Personal = require("../../models/Personal");


const PersonalDataQuery = new GraphQLObjectType({
	name: "PersonalDataQuery",
	fields: () => ({
		personalData: {
			type: PersonalDataType,
			args: {userId: {type: GraphQLID}},
			resolve(parent, args){
				return Personal.find({userId: args.userId})
			}
		}
	})
})

const PersonalDataMutation = new GraphQLObjectType({
	name: "PersonalDataMutation",
	fields: () => ({
		addData: {
			type: PersonalDataType,
			args: {
				userId: {type: GraphQLID},
				address: {type: GraphQLString},
				country: {type: GraphQLString},
				phone: {type: GraphQLString},
			},
			async resolve(parent, args){

				let cleanedAddress = sanitize(args.address);
				let cleanedCountry = sanitize(args.country);
				let cleanedPhone = sanitize(args.cleanedPhone);

				if (cleanedAddress === null || cleanedAddress === " "){
					const err = new Error("Address cannot be empty")
				}

				if (cleanedCountry === null || cleanedCountry === " "){
					const err = new Error("Country name cannot be empty")
				}

				if (cleanedPhone === null || cleanedPhone === " "){
					const err = new Error("Phone number cannot be empty")
				}

				let foundData = await Personal.find({userId: args.userId})
				if (!foundData){

					let dataObj = new Personal({
						address: cleanedAddress,
						country: cleanedCountry,
						phone: cleanedPhone,
						userId: args.userId
					})

					let savedData = dataObj.save();
					return savedData;

				} else {
					const err = new Error("You have already created the data")
				}
			}
		},
		changeData: {
			type: PersonalDataType,
			args: {
				userId: {type: GraphQLID},
				address: {type: GraphQLString},
				country: {type: GraphQLString},
				phone: {type: GraphQLString}
			},
			async resolve(parent, args){

				let cleanedAddress = sanitize(args.address);
				let cleanedCountry = sanitize(args.country);
				let cleanedPhone = sanitize(args.cleanedPhone);

				if (cleanedAddress === null || cleanedAddress === " "){
					const err = new Error("Address cannot be empty")
				}

				if (cleanedCountry === null || cleanedCountry === " "){
					const err = new Error("Country name cannot be empty")
				}

				if (cleanedPhone === null || cleanedPhone === " "){
					const err = new Error("Phone number cannot be empty")
				}

				let mutatedData = {
					address: cleanedAddress,
					country: cleanedCountry,
					phone: cleanedPhone
				}

				let chanagedData = await Personal.findOneAndUpdate({userId: args.userId}, mutatedData);
				return chanagedData;


			}
		}
	})
})

module.exports = new GraphQLSchema({
	query: PersonalDataQuery,
	mutation: PersonalDataMutation
})