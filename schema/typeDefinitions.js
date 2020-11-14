const graphql = require("graphql");
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = graphql;

const User = require("../models/User");
const Item = require("../models/Item");
const Personal = require("../models/Personal");

const PaymentMethod = require("../models/PaymentMethod");
const Order = require("../models/Order");

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		email: {type: GraphQLString},
		password: {type: GraphQLString},
		orders: {
			type: GraphQLList(OrderType),
			async resolve(parent, args){
				let found = await Order.find({userId: parent.id})
				return found;
			}
		},
		paymentMethods: {
			type: GraphQLList(PaymentMethodType),
			async resolve(parent, args){
				let found = await PaymentMethod.find({userId: parent.id})
				return found;
			}
		},
		personal: {
			type: GraphQLList(PersonalDataType),
			async resolve(parent, args){
				let found = await Personal.find({userId: parent.id})
				return found;
			}
		}
	})
})

const PersonalDataType = new GraphQLObjectType({
	name: "PersonalData",
	fields: () => ({
		id: {type: GraphQLID},
		address: {type: GraphQLString},
		country: {type: GraphQLString},
		phone: {type: GraphQLString},
		user: {
			type: UserType,
			async resolve(parent, args){
				const found = await User.findById(parent.userId);
				return found;

			}
		}
	})
})

const PaymentMethodType = new GraphQLObjectType({
	name: "Payment",
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		cardNumber: {type: GraphQLString},
		expiry: {type: GraphQLString},
		securityNumber: {type: GraphQLString},
		user: {
			type: UserType,
			async resolve(parent, args){
				let found = await User.findById(parent.userId);
				return found;
			}
		}
	})
})

const OrderType = new GraphQLObjectType({
	name: "Order",
	fields: () => ({
		id: {type: GraphQLID},
		totalSpent: {type: GraphQLInt},
		shippingAddress: {type: GraphQLString},
		orderReference: {type: GraphQLString},
		orderDate: {type: GraphQLString},
		items: {
			type: GraphQLList(ItemType),
			async resolve(parent, args){
				let found = await Item.find({orderId: parent.id})
				return found;
			}
		},
		user: {
			type: UserType,
			async resolve(parent, args){
				let found = await User.findById(parent.userId)
				return found;
			}
		}
	})
})

const ItemType = new GraphQLObjectType({
	name: "Item",
	fields: () => ({
		id: {type: GraphQLID},
		title: {type: GraphQLString},
		price: {type: GraphQLInt},
		category: {type: GraphQLString},
		description: {type: GraphQLString},
		quantity: {type: GraphQLInt},
		img: {type: GraphQLString},
		order: {
			type: OrderType,
			async resolve(parent, args){
				let found = await Order.findById(parent.orderId)
				return found;
		}}
	})
});

const AuthType = new GraphQLObjectType({
	name: "Authentication",
	fields: () => ({
		token: {type: GraphQLString},
		userId: {type: GraphQLString}
	})
})


module.exports = {
	AuthType,
	ItemType,
	OrderType,
	UserType,
	PaymentMethodType,
	PersonalDataType
}

