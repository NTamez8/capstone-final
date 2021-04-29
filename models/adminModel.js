const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


let schema = mongoose.Schema;

let admin = new schema({
    firstName:String,
    lastName:String,
    a_username:String,
    a_password:String
});

//BORROWED FROM "userModel.js", thanks :) - Darren
admin.methods.encryptPassword = async password =>{
  
    const salt = await bcrypt.genSalt(5);
  
    const hash = await bcrypt.hash(password,salt);
   
    return hash;
};

//BORROWED FROM "userModel.js", thanks :) - Darren
admin.methods.validPassword = async function(candidatePassword){
    const result = await bcrypt.compare(candidatePassword,this.a_password);
    return result;
};

module.exports = mongoose.model('Admin',admin);