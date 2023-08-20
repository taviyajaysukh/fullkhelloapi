const mongoose = require("mongoose");
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
}) 
module.exports = mongoose.model("users",userSchema);