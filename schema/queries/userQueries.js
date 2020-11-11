const graphql = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize")
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema} = graphql;

const {AuthType, UserType} = require("../typeDefinitions");
const User = require("../../models/User");

const UserQuery = new GraphQLObjectType({
	name: "UserQuery",
	fields: () => ({
		user: {
			type: UserType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				return User.findById(args.id)
			}
		},
		login: {
			type: AuthType,
			args: {email: {type: GraphQLString}, password: {type: GraphQLString}},
			resolve(parent, {email, password}){
				let cleanEmail = sanitize(email);
				let cleanPassword = sanitize(password);

				return User.findOne({email: cleanEmail}).then((user) => {
					const isEqual = bcrypt.compare(cleanPassword, user.password)
					if (!isEqual) {
						throw new Error('Password is incorrect!');
					}

					const token = jwt.sign({
						userId: user.id,
						email: cleanEmail},
						"a_super_secret",
						{expiresIn: "1h"}
					)

					return {token: token, userId: user.id}
				})
			}
		}
	})
})

const UserMutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			args: {
				name: {type: GraphQLString},
				email: {type: GraphQLString},
				password: {type: GraphQLString}
			},
			async resolve(parent, args){

				let cleanName = sanitize(args.name);
				let cleanEmail = sanitize(args.email);
				let cleanPassword = sanitize(args.password);

				const existingUser =  await User.findOne({email: cleanEmail})
				if (!existingUser){
					const error = new Error("User already exists");
				}

				const encryptedPassword =  await bcrypt.hash(cleanPassword, 12)

				let user = new User({
					name: cleanName,
					email: cleanEmail,
					password: encryptedPassword
				})

				const createdUser =  user.save();
				return createdUser
			}
		}

	}
})


module.exports = new GraphQLSchema({
	query: UserQuery,
	mutation: UserMutation,
})
