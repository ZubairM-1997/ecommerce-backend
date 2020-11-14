const graphql = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize")
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema} = graphql;

const {AuthType, UserType} = require("../typeDefinitions");
const User = require("../../models/User");

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const UserQuery = new GraphQLObjectType({
	name: "UserQuery",
	fields: () => ({
		user: {
			type: UserType,
			args: {id: {type: GraphQLID}},
			async resolve(parent, args){
				let found =  await User.findById(args.id)
				return found;
			}
		},
		login: {
			type: AuthType,
			args: {email: {type: GraphQLString}, password: {type: GraphQLString}},
			resolve(parent, {email, password}){
				let cleanEmail = sanitize(email);
				let cleanPassword = sanitize(password);

				if (cleanEmail.match(emailRegex)){
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
				} else {
					const err = new Error("Please enter a valid email address")
					return err;
				}
			}
		}
	})
})

const UserMutation = new GraphQLObjectType({
	name: "UserMutation",
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
				console.log(cleanEmail);
				let cleanPassword = sanitize(args.password);

				if (cleanEmail.match(emailRegex)){
					const existingUser =  await User.findOne({email: cleanEmail})
					console.log(existingUser)
					if (existingUser){
						const error = new Error("User already exists");
						return error;
					}

					const encryptedPassword =  await bcrypt.hash(cleanPassword, 12)

					let user = new User({
						name: cleanName,
						email: cleanEmail,
						password: encryptedPassword
					})

					const createdUser =  user.save();
					return createdUser
				} else {
					const err = new Error("Please enter a valid email address")
				}
			}
		}
	}
})


module.exports = new GraphQLSchema({
	query: UserQuery,
	mutation: UserMutation,
})
