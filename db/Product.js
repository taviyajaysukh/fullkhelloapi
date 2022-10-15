const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    productName:String,
    productPrice:Number,
    productImage:String,
    is_active:Boolean,
    updatedate:String
}) 
module.exports = mongoose.model("products",productSchema);