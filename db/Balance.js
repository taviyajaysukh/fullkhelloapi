const mongoose = require("mongoose");
const balanceSchema = new mongoose.Schema({
	mobile:Number,
	totalBallance:Number,
	createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean
})
module.exports = mongoose.model("balances",balanceSchema);