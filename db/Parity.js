const mongoose = require("mongoose");
const paritySchema = new mongoose.Schema({
	joinsection:Number,
	amount:Number,
	qty:Number,
	period:Number,
	usermobile:Number,
	price:Number,
	minutes:Number,
	seconds:Number,
	result:Number,
	color:String,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("parities",paritySchema);