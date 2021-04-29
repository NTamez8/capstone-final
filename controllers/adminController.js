const AdminModel = require('../models/adminModel');
const adminConfig = require('../config/adminConfig');
const jwt = require('jwt-simple');

let signIn = async (req,res,next)=>{
    try{
       
        const a_username = req.body.a_username;
        const a_password = req.body.a_password;
        const admin = await AdminModel.findOne({a_username});
        
        if(!admin){
            const error = new Error("Wrong admin credentials");
            error.statusCode = 401;
            throw error;
        };

        const a_validPassword = await admin.validPassword(a_password);
       
        if(!a_validPassword){
            const error = new Error("Wrong admin credentials");
            error.statusCode = 401;
            throw error;
        };
      
        const token = jwt.encode({id:admin._id},adminConfig.secret);
        res.send({message:"Successfully logged in!",token});
    }catch(error){
        res.send({messge:error.message});
    };
};

let getMe = async (req,res,next) =>{
    try{
        let me = await AdminModel.findById(req.user);
        return res.send(me);
    }catch(error){
        next(error);
    };
};

let isValid = async (req,res,next) =>{
    try{      
        res.send("Authorized");
    }catch(error){
        next(error);
    };
};

module.exports = {signIn, getMe, isValid};