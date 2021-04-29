const mongoose = require("mongoose");

let schema = mongoose.Schema;

let cartItemSchema = new schema({

    product:{type:schema.Types.ObjectId, ref:'Product'},
    quantity:Number,
   

  },{_id:false})

  module.exports = cartItemSchema;