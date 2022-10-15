const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    mobile:Number,
    password:String,
    verification_code:Number,
    recommendation_code:String,
    is_active:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("users",userSchema);