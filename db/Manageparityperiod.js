const mongoose = require("mongoose");
const manageparityperiodSchema = new mongoose.Schema({
    userMobile:Number,
    sessionPeriod:Number,
	minutes:Number,
	seconds:Number,
	periods:Number,
    is_active:Boolean,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
}) 
module.exports = mongoose.model("manageparityperiods",manageparityperiodSchema);