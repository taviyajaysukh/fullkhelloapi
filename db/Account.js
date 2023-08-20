const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
	mobile:Number,
	amount:Number,
	referralamount:Number,
	ballance:Number,
	paymentId:String,
	paymentMethod:String,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("accounts",accountSchema);