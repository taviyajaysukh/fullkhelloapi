const mongoose = require("mongoose");
const periodSchema = new mongoose.Schema({
	userMobile:Number,
	minutes:Number,
	seconds:Number,
	period:Number,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean,
})
module.exports = mongoose.model("periods",periodSchema);