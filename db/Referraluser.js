const mongoose = require("mongoose");
const referral = new mongoose.Schema({
    referraltomobile:Number,
    referralfrommobile:Number,
	referraltocode:String,
	referralfromcode:String,
    status:Boolean,
    applyreferral:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("referrals",referral);

const userSchema = new mongoose.Schema({
	userid:Number,
    mobile:Number,
    password:String,
    verification_code:Number,
    recommendation_code:String,
	promotioncode:String,
    is_active:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	referraluserS: [{ type: Schema.Types.ObjectId, ref: 'referral' }]
}) 
