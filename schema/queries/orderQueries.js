const graphql = require("graphql");
const sanitize = require("mongo-sanitize");

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema} = graphql;

const {OrderType} = require("../typeDefinitions");
const Order = require("../../models/Order");

const OrderQuery = new GraphQLObjectType({
	name: "OrderQuery",
	fields: () => ({
		order: {
			type: OrderType,
			args: {userId: {type: GraphQLID}},
			resolve(parent, args){
				return Order.find({userId: args.userId})
			}
		}
	})
})

const OrderMutation = new GraphQLObjectType({
	name: "OrderMutations",
	fields: () => ({
		createOrder: {
			type: OrderType,
			args: {
				totalSpent: {type: GraphQLInt},
				shippingAddress: {type: GraphQLString},
				orderRef: {type: GraphQLString},
				orderDate: {type: GraphQLString},
				userId: {type: GraphQLID}
			},
			resolve(parent, args){
				let cleanedAddress = sanitize(shippingAddress);
				let cleanedRef = sanitize(orderRef);
				let cleanedDate = sanitize(orderDate);

				let newOrder = new Order({
					totalSpent: args.totalSpent,
					shippingAddress: cleanedAddress,
					orderRef: cleanedRef,
					orderDate, cleanedDate,
					userId: args.userId
				})

				let savedOrder = newOrder.save();
				return savedOrder;
			}
		}
	})
})


module.exports = new GraphQLSchema({
	query: OrderQuery,
	mutation: OrderMutation
})