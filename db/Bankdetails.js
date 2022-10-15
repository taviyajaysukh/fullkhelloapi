const mongoose = require("mongoose");
const bankdetailsSchema = new mongoose.Schema({
	actualname:String,
	ifsccode:String,
	bankname:String,
	bankaccount:String,
	state:String,
	city:String,
	address:String,
	mobilenumber:Number,
	email:String,
	accountmobilenumber:Number,
	verificationcode:Number,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("Bankdetails",bankdetailsSchema);