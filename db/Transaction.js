const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
	userid:Number,
	paymentMethod:String,
	transactionType:String,
	transactionId:String,
	amount:Number,
	referralamount:Number,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("transactions",transactionSchema);