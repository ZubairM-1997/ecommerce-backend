const graphql = require("graphql");
const {UserType, PersonalDataType} = require("../typeDefinitions")
const sanitize = require("mongo-sanitize");

const Personal = require("../../models/Personal");
const User = require("../../models/User");

const PersonalDataQuery = new GraphQLObjectType({
	name: "PersonalDataQuery",
	fields: () => ({
		personalData: {
			type: PersonalDataType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				return Personal.find(args.id)
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



				let cleanedAdress = sanitize(args.address);
				let cleanedCountry = sanitize(args.country);
				let cleanedPhone = sanitize(args.cleanedPhone);

				let foundData = await Personal.findById({userId: args.userId})
				if (!foundData){

					let dataObj = new Personal({
						address: cleanedAdress,
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
				_id: {type: GraphQLID},
				userId: {type: GraphQLID},
				address: {type: GraphQLString},
				country: {type: GraphQLString},
				phone: {type: GraphQLString}
			},
			async resolve(parent, args){

				let cleanedAddress = sanitize(args.address);
				let cleanedCountry = sanitize(args.country);
				let cleanedPhone = sanitize(args.cleanedPhone);

				let mutatedData = {
					address: cleanedAddress,
					country: cleanedCountry,
					phone: cleanedPhone
				}

			}
		}
	})
})