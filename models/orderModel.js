const mongoose = require('mongoose');
const cartItemSchema = require("./cartModel");

let schema = mongoose.Schema;

let order = new schema({
    //_id:Number,
    //u_username:String,
    user_ID:{type:schema.Types.ObjectId, ref:'User'},
    //cart:String,                //stringified JSON of user's cart (Product[])
    cart:[cartItemSchema],
    datetime_requested:Date,
    datetime_fulfilled:Date,
    status:String               //can be either "in-progress","shipped","OutForDelivery",or "cancelled"

});

module.exports = mongoose.model('Order',order);
// module.exports = mongoose.model("order ",order);
