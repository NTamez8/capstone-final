const employee = require('../models/employeeModel');
const empConfig = require('../config/employeeConfig')
const validationHandler = require('../validators/validationHandler');
const jwt = require('jwt-simple');
let getAll = async (req,res,next) =>{
    try{
        let emps = await employee.find();
        res.send(emps);
    }
    catch(err)
    {
        next(err);
    }
}
let signIn = async (req,res,next)=>{
    try{
        
        let email_address = req.body.email;
        let pass = req.body.pass;
       
       let  emp = await employee.findOne({email_address});
     
        if(!emp)
        {
            const error = new Error("Wrong credentials: not a valid user");
            error.statusCode = 401;
            throw error;
        }
  
        const validPassword = await emp.validPassword(pass);
     
        if(!validPassword)
        {
            const error = new Error("Wrong credentials");
            error.statusCode = 401;
            throw error;
        }
   
        await emp.save();
        const token = jwt.encode({id:emp._id},empConfig.secret);
        res.send({token});
    }
    catch(err)
    {
    
      
        next(err);
    }
}

let isValid = async (req,res,next)=>{
    try{      
        res.send("Authorized");
    }catch(error){
        next(error);
    };
}
let addEmployee = async (req,res,next) =>
{
    try{
        validationHandler(req);
        let newEmp = new employee();

        

       

        newEmp.firstName = req.body.firstName;
        newEmp.lastName = req.body.lastName;
        newEmp.email_address = req.body.email_address;

        

        newEmp.e_password = await newEmp.encryptPassword('1234');
        newEmp.first_login = true;
       await newEmp.save();
        res.send({"message":"Success",newEmp});
    }
    catch(err){
        next(err);
    }
}

let deleteEmployee = async (req,res,next)=>{

    try{
        let id = req.params.id;
        let emp = await employee.findById(id);
        if(emp == null)
        {
            let error = new Error('Bad request');
            error.statusCode = 400;
            throw error;
        }
        await emp.delete();
        res.send({"message":"deleted"});
    }
    catch(err)
    {
        next(err);
    }
}


let editPassword= async (req,res)=>{
    /*
    let email_address=req.body.email_address;
    let e_password=req.body.e_password
    employee.updateMany({email_address:email_address},{$set:{e_password:e_password}},(err,result)=>{
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
    })*/
    try
    {
        let emp = req.user;
         emp.e_password = await emp.encryptPassword(req.body.e_password);
        await emp.save();
        res.send('success');
    }
    catch(err)
    {
        next(err)
    }
   
}





module.exports = {addEmployee,deleteEmployee,getAll,editPassword,signIn,isValid}
