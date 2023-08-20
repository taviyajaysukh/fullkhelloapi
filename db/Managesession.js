const mongoose = require("mongoose");
const managesessionSchema = new mongoose.Schema({
	sessionid:Number,
	session:Number,
    createddate:{ type: Date, default: Date.now },
	updateddate:{ type: Date, default: Date.now },
	status:Boolean,
})
module.exports = mongoose.model("managesessions",managesessionSchema);