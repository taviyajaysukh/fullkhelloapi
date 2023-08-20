const mongoose = require("mongoose");
const manageperiodSchema = new mongoose.Schema({
	id:Number,
	period:Number,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean,
})
module.exports = mongoose.model("manageperiods",manageperiodSchema);