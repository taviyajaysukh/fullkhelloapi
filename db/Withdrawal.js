const mongoose = require("mongoose");
const withdrawalSchema = new mongoose.Schema({
	usermobile:Number,
	contactid:String,
	amount:Number,
	accounttype:String,
	name:String,
	ifsccode:String,
	accountnumber:Number,
	fundaccountid:String,
	currency:String,
	mode:String,
	purpose:String,
	referenceid:String,
	narration:String,
	randomkey1:String,
	randomkey2:String,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("withdrawals",withdrawalSchema);