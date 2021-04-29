const mongoose = require('mongoose');


let schema = mongoose.Schema;

let ticket = new schema({

    //u_username:String,              //user who raised the ticket
    user_ID:{type:schema.Types.ObjectId, ref:'User'},
    reason:String,
    datetime_raised:Date,
    datetime_resolved:Date,
    status:String                   //can be either "in-progress" or "resolved"
});

module.exports = mongoose.model('Ticket',ticket);