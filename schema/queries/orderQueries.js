const graphql = require("graphql");
const sanitize = require("mongo-sanitize");

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList} = graphql;

const {OrderType} = require("../typeDefinitions");
const Order = require("../../models/Order");

const OrderQuery = new GraphQLObjectType({
	name: "OrderQuery",
	fields: () => ({
		order: {
			type: GraphQLList(OrderType),
			args: {userId: {type: GraphQLID}},
			resolve(parent, args){
				let found = Order.find({userId: args.userId})
				return found;
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
				orderReference: {type: GraphQLString},
				orderDate: {type: GraphQLString},
				userId: {type: GraphQLID}
			},
			resolve(parent, args){
				let cleanedAddress = sanitize(args.shippingAddress);
				let cleanedRef = sanitize(args.orderReference);
				let cleanedDate = sanitize(args.orderDate);

				let newOrder = new Order({
					totalSpent: args.totalSpent,
					shippingAddress: cleanedAddress,
					orderReference: cleanedRef,
					orderDate: cleanedDate,
					userId: args.userId
				})

				let savedOrder = newOrder.save();
				return savedOrder;
			}
		},
		changeTotalSpent: {
			type: OrderType,
			args: {
				totalSpent: {GraphQLInt},
				orderId: {type: GraphQLID}
			},
			async resolve(parent, args){
				await Order.findByIdAndUpdate(args.orderId, {totalSpent: args.totalSpent});
				let updated = Order.findById(args.orderId)
				return updated;

			}
		}
	})
})


module.exports = new GraphQLSchema({
	query: OrderQuery,
	mutation: OrderMutation
})