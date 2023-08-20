const mongoose = require("mongoose");
const interestSchema = new mongoose.Schema({
	mobile:Number,
	amount:Number,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("interests",interestSchema)