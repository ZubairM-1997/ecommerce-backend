const graphql = require("graphql");
const sanitize = require("mongo-sanitize");

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema} = graphql;

const {PersonalDataType} = require("../typeDefinitions")
const Personal = require("../../models/Personal");


const PersonalDataQuery = new GraphQLObjectType({
	name: "PersonalDataQuery",
	fields: () => ({
		personalData: {
			type: PersonalDataType,
			args: {userId: {type: GraphQLID}},
			async resolve(parent, args){
				let found = await Personal.find({userId: args.userId});
				return found;
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
				let cleanedPhone = sanitize(args.phone);

				if (cleanedAddress === null || cleanedAddress === " "){
					const err = new Error("Address cannot be empty")
					return err
				}

				if (cleanedCountry === null || cleanedCountry === " "){
					const err = new Error("Country name cannot be empty")
					return err
				}

				if (cleanedPhone === null || cleanedPhone === " "){
					const err = new Error("Phone number cannot be empty")
					return err
				}

				let foundData = await Personal.findOne({userId: args.userId})
				console.log(!foundData);
				if (foundData){
					const err = new Error("You have already created the data")
					return err;

				} else {

					let dataObj = new Personal({
						address: cleanedAddress,
						country: cleanedCountry,
						phone: cleanedPhone,
						userId: args.userId
					})

					let savedData = dataObj.save();
					return savedData;

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
				console.log(args.phone)

				let cleanedAddress = sanitize(args.address);
				let cleanedCountry = sanitize(args.country);
				let cleanedPhone = sanitize(args.phone);

				console.log(cleanedPhone);


				if (cleanedAddress === null || cleanedAddress === " "){
					const err = new Error("Address cannot be empty")
					return err;
				}

				if (cleanedCountry === null || cleanedCountry === " "){
					const err = new Error("Country name cannot be empty")
					return err;
				}

				if (cleanedPhone === null || cleanedPhone === " "){
					const err = new Error("Phone number cannot be empty")
					return err;
				}

				let mutatedData = {
					address: cleanedAddress,
					country: cleanedCountry,
					phone: cleanedPhone
				}

				let changedData = await Personal.findOneAndUpdate({userId: args.userId}, mutatedData);
				let newData = await Personal.findOne({userId: args.userId});
				console.log(newData);
				return newData;


			}
		}
	})
})

module.exports = new GraphQLSchema({
	query: PersonalDataQuery,
	mutation: PersonalDataMutation
})