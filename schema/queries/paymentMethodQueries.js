const graphql = require("graphql");
const sanitize = require("mongo-sanitize");
const bcrypt = require("bcrypt")

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema} = graphql;

const visa = /^4[0-9]{12}(?:[0-9]{3})?$/
const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/
const cvv = /^[0-9]{3,4}$/

const {PaymentMethodType} = require("../typeDefinitions");
const Payment = require("../../models/PaymentMethod");

const PaymentMethodQuery = new GraphQLObjectType({
	name: "PaymentMethodQuery",
	fields: () => ({
		paymentMethod: {
			type: PaymentMethodType,
			args: {userId: {type: GraphQLID}},
			resolve(parent, args){
				return Payment.find({userId: args.userId})
			}
		}
	})
})

const PaymentMethodMutation = new GraphQLObjectType({
	name: "PaymentMethodMutation",
	fields: () => ({
		addPayment: {
			type: PaymentMethodType,
			args: {
				name: {type: GraphQLString},
				cardNumber: {type: GraphQLString},
				expiry: {type: GraphQLString},
				securityNumber: {type: GraphQLString},
				userId: {type: GraphQLID}
			},
			async resolve(parent, args){

				let cleanedName = sanitize(args.name);
				let cleanedCardNumber = sanitize(args.cardNumber);
				let cleanedExpiry = sanitize(args.expiry);
				let cleanedSecurity = sanitize(args.securityNumber);



				let secureCardNumber;
				let newCvv;

				if (cleanedSecurity.match(cvv)){
					let str = "**"
					let firstDigit = cleanedSecurity[0]
					newCvv = firstDigit.concat(str)
				} else {
					const err = new Error("Please input the correct CVV number format")
					return err;
				}

				if (cleanedCardNumber.match(visa) || cleanedCardNumber.match(mastercard)){


					let firstHalf = cleanedCardNumber.substring(0, 8);
					let secondHalf = cleanedCardNumber.substring(8, 16);
					let hashedSecondHalf = await bcrypt.hash(secondHalf, 6);

					secureCardNumber = firstHalf.concat(hashedSecondHalf);

				} else {
					const err = new Error("Must be a Visa or a MasterCard")
					return err;
				}

				let newPayment = new Payment({
					name: cleanedName,
					userId: args.userId,
					cardNumber: secureCardNumber,
					expiry: cleanedExpiry,
					securityNumber: newCvv
				})

				let savedPayment = newPayment.save();
				return savedPayment;
			}
		},
		deletePayment: {
			type: PaymentMethodType,
			args: {
				_id: {type: GraphQLID},
			},
			async resolve(parent, args){
				const foundPaymentMethod = await Payment.findByIdAndDelete(args._id);

				return foundPaymentMethod;
			}
		}

		})
	}
)

module.exports = new GraphQLSchema({
	query: PaymentMethodQuery,
	mutation: PaymentMethodMutation
})