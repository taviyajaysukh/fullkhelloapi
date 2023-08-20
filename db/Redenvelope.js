const mongoose = require("mongoose");
const redenvelopeSchema = new mongoose.Schema({
    mobile:Number,
    fixedmony:Number,
    password:String,
    status:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("redenvelopes",redenvelopeSchema);