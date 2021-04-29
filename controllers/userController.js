const Order = require('../models/orderModel');
const ProductController = require('../controllers/productController')
const ticketControl = require('../controllers/ticketController');
const User = require('../models/userModel');
const validationHandler = require('../validators/validationHandler');
const userConfig = require('../config/userConfig');
const jwt = require('jwt-simple');


let getAll = async (req,res,next)=>{
    try
    {
        let users = await User.find({});
        res.send(users);
    }
    catch(err)
    {
        next(err);
    }
}

let signIn = async (req,res,next)=>{
    let user;
  
    try{
        
        let u_username = req.body.email;
        let pass = req.body.pass;
         user = await User.findOne({u_username});
        
        if(!user)
        {
            const error = new Error("Wrong credentials: not a valid user");
            error.statusCode = 401;
            throw error;
        }
        if(user.failedAttempts >= 3)
        {
           
           
            const error = new Error("Exceeded max login");
            user.locked = true;
            await user.save();
            error.statusCode = 401;
            throw error;

           
        }
        const validPassword = await user.validPassword(pass);
       
        if(!validPassword)
        {
            const error = new Error("Wrong credentials");
            error.statusCode = 401;
            throw error;
        }
        user.failedAttempts = 0;
        await user.save();
        const token = jwt.encode({id:user._id},userConfig.secret);
        res.send({token});
    }
    catch(err)
    {
    
        if(err.message == 'Wrong credentials')
            {
                increaseUserFailedAttempts(user);
            }
      
        next(err);
    }
}


async function increaseUserFailedAttempts(user)
{
    let numFailed = user.failedAttempts;
    if(!numFailed)
    {
        user.failedAttempts = 1;
    }
    else
    {
        user.failedAttempts = numFailed + 1;
    }
   

    await user.save();
}


let signUp = async (req,res,next)=>{
    try{
       
        validationHandler(req);
        let user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.u_username = req.body.u_username;
        user.u_password = await user.encryptPassword(req.body.u_password);
       
        user.address = req.body.address;
        user.phone_number = req.body.phone_number;
        user.date_of_birth = req.body.date_of_birth;
        user.locked = false;
        user.funds = 1000;
        user.order_history = null;
        user.failedAttempts = 0;
        user.currentCart = [];
        user.accountN = 1001;
        await user.save();
        const token = jwt.encode({id:user._id},userConfig.secret);
        res.send({token});
    }
    catch(err)
    {
        next(err);
    }
}

let isValid = async (req,res,next) =>{
    try{
      
        res.send("Authorized");
    }
    catch(err)
    {
        next(err);
    }
}
let getMe = async(req,res,next)=>
{
    try{
      
       let me = await User.findById(req.user);
       return res.send(me);
    }
    catch(err)
    {
        next(err);
    }
}


// --------------------------------Adding changes to the Cart-----------------------------------//
let addItemstoCart = async (req, res, next) => {
   
    try
    {
        let wasFound = false;
       // let user = User.findOne({_id:req.user});
       let user = req.user;
        let product_ID = req.body.product_ID
     
        let quantity = req.body.quantityDesired;
     
        for(let x = 0; x < user.currentCart.length; x++)
        {
            if(user.currentCart[x].product == product_ID)
            {
                user.currentCart[x].quantity += eval(quantity);
                wasFound = true;
                break;
            }
        }
        if(!wasFound)
        {
            user.currentCart.push({product:product_ID,quantity})
        }
        ProductController.userUpdateProduct(product_ID,quantity);
        await user.save();
        res.send({"message":"Success"})
    }
    catch(err)
    {
        next(err);
    }
  };

let deleteItemsfromCart = async (req, res, next) => {
    let userOrder= await User.findOne({_id:user_id});
    userOrder.currentCart.updateMany({user_id  : req.params.user_id }, 
        { $pull: { product : {pname: req.params.pname }}}, {multi: true}, (err, result)=> {
            if (!err){
                res.send("Items in cart deleted successfully" + result)
            } 
            else{
             res.send("Error generated "+err)
            }
        })
    };
let deleteItemById = async (req,res,next)=>{
    try
    {
        let userOrder = req.user;
        let Prod_id = req.params.id;
        for(let x = 0; x < userOrder.currentCart.length; x++)
        {
            if(userOrder.currentCart[x].product == Prod_id)
            {
                ProductController.userAddBackProduct(userOrder.currentCart[x].product,userOrder.currentCart[x].quantity)
                userOrder.currentCart.splice(x,x+1);
            }
        }
        await userOrder.save();
        res.send({"message":"success"});
    }
    catch(err)
    {
        next(err);
    }
   
}
let viewItemsfromCart = async(req,res)=> {
       // let userOrder= req.user;
       //console.log(req.user);
        let userOrder = await User.findOne({_id:req.user._id}).populate('currentCart.product');
       // userOrder.currentCart.populate('Product').exec();
       
        let total_amount = 0;
        
        for(let i = 0; i < userOrder.currentCart.length; i++){
                total_amount += userOrder.currentCart[i].product.price * userOrder.currentCart[i].quantity;
        }
      
      
        res.send(userOrder.currentCart);
    
    }

let checkoutCart = async(req,res,next)=>{
    try
    {
   
       // let user_id = req.body.user_id;
        let userOrder = new Order();
        //let user = await User.findOne({_id:user_id});
        let user = await User.findOne({_id:req.user._id}).populate('currentCart.product');
        userOrder.cart = user.currentCart;
        userOrder.user_ID = user._id;
        userOrder.status="in progress";
        //let funds = await User.findById(userOrder.funds);
        //let cart = userOrder.currentCart;
        let total_amount = 0;
        for(let i = 0; i < user.currentCart.length; i++){
                total_amount +=  user.currentCart[i].product.price *  user.currentCart[i].quantity;
        }
       
        if(user.funds >= total_amount){
        user.funds = user.funds - total_amount;
        user.currentCart = []
        user.save();
        //get current date/time for userOrder.date_requested
        //then save the userOrder.
        userOrder.datetime_requested = Date.now();
       
        userOrder.save()
        res.send({"msg":"Cart checkout successful"});
        }else{
            res.send({"msg":"Insufficient funds to checkout"});
        }
    }
    catch(err)
    {
        next(err);
    }

}

let updatestatusToUser=async(req,res)=>{
    let u_username=req.body.u_username;
    let locked=req.body.locked;
    User.updateOne({u_username:u_username},{"$set":{locked:locked}},(err,result)=> {
        if(!err){
            console.log(result.funds);
            if(result.funds > cost){
                let newFunds ={};
                newFunds.fund = cost - result.funds;
                newFunds.approved = true;
                newFunds.error="";
                res.json(newFunds);
            }else{
                let errorObj = {fund:0,error: "funds are not sufficient",approved: false};
                res.json(errorObj);
            }
        }else{
            res.send("Record not found");
        }
    })
}

let unlockLockUser=async(req,res,next)=>{
    try{
       
        let u_username = req.body.u_username;
        let locked = req.body.locked;
        let ticketID = req.body.ticket;

        let user = await User.findOne({_id:u_username});
        user.locked = false;
        user.failedAttempts = 0;
        ticketControl.deleteTicket(ticketID);
         await user.save();
         res.send('success');
        //console.log(User.findOne({u_username:u_username}));
        //if locked, unlock the account
        /*
        if(locked){
            locked = false;
            User.updateOne({_id:u_username},{"$set":{locked:locked}},(error,result)=>{
                if(!error){
                    ticketControl.deleteTicket(ticketID);
                    res.send('success');
                    
                }else{
                    res.send(`Error during User unlock: ${{"user":u_username,error}}`);
                }
            });
        //if unlocked, lock the account
        }else{
            locked = true;
            User.updateOne({u_username:u_username},{"$set":{locked:locked}},(error,result)=>{
                if(!error){
                    res.send(`${u_username} is now locked!`)
                }else{
                    res.send(`Error during User lock: ${{"user":u_username,error}}`);
                }
            });
        }*/
    }
    catch(err)
    {
        next(err)
    }
}
let updateProfile=(req,res)=>{
    let u_username=req.body.user
    let address=req.body.address;
    let date_of_birth=req.body.date_of_birth;
    let phone_number=req.body.phone_number;
    user.updateMany({u_username:u_username},{$set:{address:address,date_of_birth:date_of_birth,phone_number:phone_number}},(err,result)=>{
        if(!err){
            if(result.nModified>0){
            res.send("Profile updated succesfully"+result)
            }
            else{
                res.send("profile is not updated successfully")
            }
        }
    })
}
let updatePassword=(req,res)=>{
    let u_username=req.body.u_username;
    let u_password=req.body.u_password
    user.updateMany({u_username:u_username},{$set:{u_password:u_password}},(err,result)=>{
        if(!err){
            if(result.nModified>0){
            res.send("Password updated succesfully"+result)
            }
            else{
                res.send("Email is not available")
            }
        }
        else{
            res.send("Error  "+err);
        }
    })
}

let updateFunds = async (req,res,next) =>{

   // console.log(req);
   //console.log(req.body)
    let currUser = req.user;
    //console.log(currUser);
    currUser.funds += eval(req.body.fundsRef);
    await currUser.save()
    res.send('success');

    /*
    let account =req.body.account;
    let amount =req.body.amount;
    user.find({u_username: id , accountN:account},(err1,result)=>{
        if(!err1){
            if(result1.balance > amount){
                let newBalance =result1.balance - amount ;
                let newFunds = result1.balance + amount;
                user.updateOne(
                    {u_username:id , accountN:account},
                    {$set:{balance: newBalance, funds: newFunds}},
                    (err2,result) =>{
                        if(!err2){
                            if(result2.nModified > 0){
                                res.send("Funds and balance is updated");
                            }else{
                                res.send("account is not available");
                            }
                        }else{
                            res.send("chcek account number");
                        }
                    }
                )
            }else{
                res.send("Amount not sufficient for transfer");
            }
        }
    })*/
}
let checkFunds =(req,res) =>{
    let id =   req.body.id;
    let cost = req.body.cost;
    user.find({u_username:id},(err,result)=>{
        if(!err){
            console.log(result.funds);
            if(result.funds > cost){
                let newFunds ={};
                newFunds.fund = cost - result.funds;
                newFunds.approved = true;
                newFunds.error="";
                res.json(newFunds);
            }else{
                let errorObj = {fund:0,error: "funds are not sufficient",approved: false};
                res.json(errorObj);
            }
        }else{
            res.send("Record not found");
        }
    })
}
let editPassword=(req,res)=>{
    let u_username=req.body.u_username;
    let u_password=req.body.u_password
    user.updateMany({u_username:u_username},{$set:{u_password:u_password}},(err,result)=>{
        if(!err){
            if(result.nModified>0){
            res.send("Password updated succesfully"+result)
            }
            else{
                res.send("Email is not available")
            }
        }
        else{
            res.send("Error  "+err);
        }
    })
}
//Retrive order staus
let orderstatusToUser=(req,res)=>{
    let orderdetails = neworder ({
        status:req.body.order_history,
    });
    
}



module.exports = {signIn,signUp, deleteItemById,
    //selectItemsfromCart,
    unlockLockUser,addItemstoCart, checkoutCart,deleteItemsfromCart,updateProfile,updatePassword, isValid,viewItemsfromCart,updatestatusToUser,orderstatusToUser,getAll,getMe ,checkFunds,editPassword,updateFunds}



