const mongoose = require('mongoose');


let schema = mongoose.Schema;

let request = new schema({
    //e_username:String,              //employee who requested the change
   // product_id:Number,              //_id in "productModel.js"
   employee_id:{type:schema.Types.ObjectId, ref:'Employee'},
   product_id:{type:schema.Types.ObjectId, ref:'Product'},
    new_quantity:Number,
    datetime_requested:Date,
    datetime_resolved:Date,
    status:String                   //can be either "in-progress" or "resolved"
});

module.exports = mongoose.model('Request',request);