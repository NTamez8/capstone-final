const ticket = require('../models/ticketModel');
const User = require('../models/userModel');
let getDetailOfUser=(req,res)=>{
    // let u_username=req.params.u_username;     //passing through path param
   // let user_ID=req.params.user._id;
    ticket.find({},(err,data)=>{
        if(!err){
            res.json(data);    //return array
        }
    })
}

let getLockedUsers = async (req,res,next)=>{
    try
    {
        let tickets = await ticket.find({status:'unviewed'}).populate('user_ID');
        console.log(tickets);
        res.send(tickets);
    }
    catch(err)
    {
        next(err);
    }
}

let raiseTicket = async (req,res)=>{

  console.log(req.body);
    let user = await User.findOne({u_username:req.body.user});


    let newTicket = ticket({
        user_ID: user._id,
        reason:req.body.ticket,
        datetime_raised : Date.now(),
        status:'unviewed',
        datetime_resolved:null
    })
    
    newTicket.save((err,result)=> {
        if(!err){
            res.send({"message":"Ticket raised successfully! "+result})
        }else {
            res.send({"message":"Ticket unable to raise! "+err});
        }
    })
  
}

let deleteTicket = async (id)=>{
    await ticket.deleteOne({_id:id})
}
module.exports = {getDetailOfUser, raiseTicket,getLockedUsers,deleteTicket}
