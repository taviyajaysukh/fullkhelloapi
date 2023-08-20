const mongoose = require("mongoose");
const referralSchema = new mongoose.Schema({
    referraltomobile:Number,
    referralfrommobile:Number,
	referraltocode:String,
	referralfromcode:String,
    status:Boolean,
    applyreferral:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("referrals",referralSchema);