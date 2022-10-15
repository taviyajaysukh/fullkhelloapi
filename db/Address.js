const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
	userid:Number,
	fullname:String,
	mobilenumber:Number,
	pincode:Number,
	state:String,
	city:String,
	detailsaddress:String,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("addresses",addressSchema);