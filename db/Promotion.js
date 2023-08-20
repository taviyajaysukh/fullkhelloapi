const mongoose = require("mongoose");
const promotionSchema = new mongoose.Schema({
    mobile:Number,
	promotioncode:String,
    status:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("promotions",promotionSchema);