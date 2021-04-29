const request = require('../models/requestModel');

let getRequestById = async(req,res)=>{
    //console.log(req.params.request_id);
    await request.find({_id:req.params.request_id},(error,data)=>{
        if(!error){
            //console.log(data);
            res.json(data);
        }else{
            res.send(`Error during request retrieval: ${error}`);
        };
    });
};

let getAllRequests = async(req,res)=>{
    //console.log("Retrieving Requests");
    await request.find({},(error,data)=>{
        if(!error){
            res.json(data);
        }else{
            res.send(`Error during request retrieval: ${error}`);
        };
    });
};

let sendRequest=(req,res)=>{
    let productdetails = new request({
        product_id:req.body.product_id,
        e_user:req.body.e_username,
        new_quantity:req.body.new_quantity,
        status:'',
        datetime_requested:Date.now(),
        datetime_resolved:null
        });
    productdetails.save((err,result)=>{
        if(!err){
            // res.send("request send  successfully"+result)
            //  res.json({"msg":"Record Stored successfully"})
            // commented out sending back json instead
           // res.send({"msg":"request send  successfully"+result})
           res.send("request send  successfully"+result)
            //res.json("msg":"Record Stored successfully")
        }else{
           // res.send({"msg":"request Didn't send ,check again"+err})
           res.send("request Didn't send ,check again"+err)
        }

    
    });

}

let resolveRequest = async(req,res)=>{

    try{
        await request.updateOne({_id:req.body.request_id},{$set:{status:"resolved",datetime_resolved:Date.now()}},(error,data)=>{
            if(!error){
                if(data.modifiedCount>0){
                    res.send("Request successfully resolved!");
                }else{
                    res.send("Request was not able to be resolved");
                }
            }else{
                res.send(`Error during request resolving: ${error}`);
            }
        });
    }catch(tryError){
        res.send(`Erorr during request resolving: ${tryError}`);
    }
};

let deleteRequestById = (req,res)=>{
    try{
        const request_id = req.body.request_id;
        request.deleteOne({_id:request_id},(error,data)=>{
            if(!error){
                if(data.deletedCount > 0){
                    res.send("Request was successfully deleted.");
                }else{
                    res.send("Request was not deleted.");
                }
            }else{
                res.send(`Error during request deletion: ${error}`);
            }
        });
    }catch(tryError){
        res.send(`Error during request deletion: ${tryError}`);
    }
};

module.exports = {getRequestById, getAllRequests, sendRequest, resolveRequest, deleteRequestById};
