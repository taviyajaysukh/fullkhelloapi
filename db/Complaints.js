const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
	type:String,
	outid:Number,
	whatsapp:Number,
	description:String,
	userid:Number,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("Complaints",complaintSchema);