const graphql = require("graphql");
const sanitize = require("mongo-sanitize");

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLInt} = graphql;

const {ItemType} = require("../typeDefinitions");
const Item = require("../../models/Item");

const ItemQuery = new GraphQLObjectType({
	name: "ItemQuery",
	fields: () => ({
		item:	{
			type: ItemType,
			args: {orderId: {type: GraphQLID}},
			resolve(parent, args){
				return Item.find({orderId: args.orderId})
			}
		}
	})
})

const ItemMutation = new GraphQLObjectType({
	name: "ItemMutation",
	fields: () => ({
		createItem: {
			type: ItemType,
			args: {
				title: {type: GraphQLString},
				price: {type: GraphQLInt},
				category: {type: GraphQLString},
				description: {type: GraphQLString},
				img: {type: GraphQLString},
				quantity: {type: GraphQLInt},
				orderId: {type: GraphQLID}
			},
			resolve(parent, args){
				let newItem = new Item({
					title: args.title,
					price: args.price,
					category: args.category,
					description: args.description,
					img: args.img,
					quantity: args.quantity,
					orderId: args.orderId
				})

				let savedItem = newItem.save();
				return savedItem;
			}
		},

		changeQuantity: {
			type: ItemType,
			args: {
				Id: {type: GraphQLID},
				quantity: {type: GraphQLInt}
			},
			async resolve(parent, args){

				if (args.quantity === 0){
					const deleted = await Item.findByIdAndDelete(args.Id);
					let message = {
						msg: "This item is deleted",
						item: deleted
					}
					return message;
				}

				let updatedQuantity = args.quantity
				let updatedItem = await Item.findByIdAndUpdate(args.Id, {quantity: updatedQuantity})


				return updatedItem
			}

		}
	})
})

module.exports = new GraphQLSchema({
	query: ItemQuery,
	mutation: ItemMutation
})