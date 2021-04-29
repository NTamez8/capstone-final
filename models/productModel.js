const mongoose = require('mongoose');


let schema = mongoose.Schema;

let product = new schema({
    name:String,
    description:String,
    price:Number,
    quantity:Number
});



module.exports = mongoose.model('Product',product);