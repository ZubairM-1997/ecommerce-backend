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
			type: new GraphQLList(OrderType),
			resolve(parent, args){
				return Order.find({userId: parent.id})
			}
		},
		paymentMethods: {
			type: new GraphQLList(PaymentMethodType),
			resolve(parent, args){
				return PaymentMethod.find({userId: parent.id})
			}
		},
		personal: {
			type: PersonalDataType,
			resolve(parent, args){
				return Personal.findById({userId: parent.id})
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
			resolve(parent, args){
				User.findById(parent.userId)
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
			resolve(parent, args){
				return User.findById(parent.userId)
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
			type: new GraphQLList(ItemType),
			resolve(parent, args){
				return Item.find({orderId: parent.id})
			}
		},
		user: {
			type: UserType,
			resolve(parent, args){
				return User.findById(parent.userId)
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
			resolve(parent, args){
				return Order.findById(parent.orderId)
			}
		}
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

