const mongoose = require("mongoose");
const bankdetailsSchema = new mongoose.Schema({
	actualname:String,
	ifsccode:String,
	bankname:String,
	bankaccount:Number,
	state:String,
	city:String,
	address:String,
	mobilenumber:Number,
	email:String,
	accountmobilenumber:Number,
	verificationcode:Number,
	contactid:String,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("Bankdetails",bankdetailsSchema);