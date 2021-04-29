const order = require('../models/orderModel');
const User = require('../models/userModel');
// let getOrderById=(req,res)=>{
//     // let oid=req.params.oid;     //passing through path param
//     order.find({_id:oid},(err,data)=>{
//         if(!err){
//             res.json(data);    //return array
//         }
//     })
// }

let getOrderById=(req,res)=>{
    // let u_username=req.params.u_username;     //passing through path param
   // let user_ID=req.params.user._id;
   order.find({},(err,data)=>{
        if(!err){
            res.json(data);    //return array
        }
    })
}


let updateOrderByStatus= async (req,res,next)=>{
    try
    {
        console.log('here');
        // get the orders id and the status to change to
        let _id=req.body.id;
        let status=req.body.status;

        // get the order that is to be changed
        let currOrder = await order.findById(_id).populate('cart.product');

        // if the order is null then throw error
        if(currOrder == null)
        {
            let error = new Error('Bad request');
            error.statusCode = 400;
            throw error;
        }

        // if the status is canceled 
        if(status == 'canceled' || status == 'cancelled')
        {
            let refund = 0;

            // get the cart from the order
            let cart = currOrder.cart;
            let length = cart.length;

            // iterate
            for(let x = 0; x < length; x++)
            {
                // sum the products
                refund += cart[x].product.price * cart[x].quantity;
            }
            console.log(refund);
    
            // get the owner of the order
            let currUser = await User.findById(currOrder.user_ID);
            // add back the funds
            currUser.funds += refund;
            // save the changes to the user
            await currUser.save();
        }
       // regardless update the status
        currOrder.status = status;
        //save the status
            await currOrder.save();
            // send message
        res.send({"Message":"Success"});
    }
    catch(err)
    {
        next(err);
    }
  
    /*
    order.updateMany({_id:_id},{$set:{status:status}},(err,result)=>{
        if(!err){
            if(result.nModified>0){
            res.send("Order status updated succesfully"+result)

            if(status=="cancelled"){
               // res.send(user.funds);
               //total=fund+price
               //
              // let refund=req.body.refund;
    
              let funds = req.body.funds
               //let u_username=User.req.body.u_username;
               let price =cart.price;
               let quantity =User.cart.quantity;
               //var fixfund = 1000;
                price = 50;
                quantity=2
              let sum = price*quantity;
               User.updateMany({_id:_id},{$set:{funds:sum}},(err,result1)=>{
                if(!err){
                    res.send("refund"+result1)
                }
            })
               console.log(sum)
               


            }

            }
            else{
                res.send("Order is not Upadated")
            }
        } else {
            res.send("Error generated " + err);
        }
    }).populate('cart.product');*/
}

// let storeOrderByStatus=(req,res)=>{
//     let orderdetails = new order({
//         _id:req.body.oid,
//         status:req.body.status,

        
//     });
//     orderdetails.save((err,result)=>{
//         if(!err){
//             res.send("order status upadted  successfully"+result)
//             //res.json("msg":"Record Stored successfully")
//         }else{
//             res.send("Order Didn't upadte"+err)
//         }


    
//     })

// }


let getOrdersByDay = async (req, res, next) => {
    try {
        let day = req.body.day;
        if(day == null)
        {
            let error = new Error('Bad request');
            error.statusCode = 400;
            throw error;
        }
        let beginDay = addDay(day,-1);
        beginDay = addDay(beginDay,1);
        let endDay = addDay(day,1);
      
        day = new Date(day);
      
        let foundOrders = await order.find({
            datetime_requested: {
                $gte: beginDay,
                $lt: endDay
            }  ,status:{$not:{$eq:'cancelled'}}
        }).populate('cart.product');
        res.send(foundOrders);
    } catch (err) {
        next(err)
    }
}

function addDay(date, day) {
    var result = new Date(date);
    result.setDate(result.getDate() + day);
    return result;
}

let getOrdersByWeek = async (req, res, next) => {
    try {
        let weekStart = req.body.dateStart;
        if(weekStart == null)
        {
            let error = new Error('Bad request');
            error.statusCode = 400;
            throw error;
        }
        let weekEnd = addDay(weekStart, 8).toDateString();
        weekEnd = new Date(weekEnd);
        weekStart = new Date(weekStart);
       
        let foundOrders = await order.find({
            datetime_requested: {
                $gte: weekStart,
                $lt: weekEnd
            }  ,status:{$not:{$eq:'cancelled'}}
        }).populate('cart.product');
        res.send(foundOrders);
    } catch (err) {
        next(err)
    }
}

let getOrdersByMonth = async (req, res, next) => {
    try {
        let monthStart = req.body.monthStart;
        if(monthStart == null)
        {
            let error = new Error('Bad request');
            error.statusCode = 400;
            throw error;
        }
        let date = new Date(monthStart);
        let month = date.getMonth();
       
        let year = '';
        if (month == 12) {
            month = 0;
            year = date.getFullYear() + 1;
        } else {
            month++;
            year = date.getFullYear();
        }
        let day = 1;
        let nextMonth = new Date(year, month + 1, day);
        
        

        let foundOrders = await order.find({
            datetime_requested: {
                $gte: date,
                $lt: nextMonth.toLocaleDateString()
            }
            ,status:{$not:{$eq:'cancelled'}}
        }).populate('cart.product');
        res.send(foundOrders);
    } catch (err) {
        next(err)
    }
}
let getorderstatusToUser=(req,res)=>{
    let status=req.body.status;
    order.find({status:status},(err,data)=>{
        if(!err){
            res.json(data);    //return array
        }
    })
}
let getOrdersByProduct = async (req, res, next) => {
    try {
        let productId = req.params.id;
        let ordersByProd = await order.find({ status:{$not:{$eq:'cancelled'}}},{
           // "cart.product": productId
           cart:{$elemMatch:{product:productId}} 
        }).populate('cart.product');


        res.send(ordersByProd);

    } catch (err) {
        next(err)
    }
}

let getOrdersByCust = async (req, res, next) => {
    try {
        let custId = req.params.id;
        let ordersByProd = await order.find({
            user_ID: custId  ,status:{$not:{$eq:'cancelled'}}
        }).populate('cart.product');
        if (!ordersByProd) {
            const error = new Error("Wrong credentials");
            error.statusCode = 401;
            throw error;
        }
        res.send(ordersByProd);
    } catch (err) {
        next(err)
    }
}

let getUserOrder = async (req,res,next)=>{
    try
    {
        let user = req.user;
        let orders = await order.find({user_ID:user._id})
        res.send(orders);
    }
    catch(err)
    {
        next(err);
    }
}

module.exports = {
    getUserOrder,
    getOrderById,
    updateOrderByStatus,
    getOrdersByDay,
    getOrdersByWeek,
    getOrdersByMonth,
    getOrdersByCust,
    getOrdersByProduct,
    getorderstatusToUser
}
