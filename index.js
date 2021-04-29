const serverConfig = require('./config/serverConfig');
const mongooseConfig = require('./config/dbConfig');

const adminRoutes = require('./routes/adminRoute');
const employeeRoutes = require('./routes/employeeRoute');
const orderRoutes = require('./routes/orderRoute');
const productRoutes = require('./routes/productRoute');
const requestRoutes = require('./routes/requestRoute');
const ticketRoutes = require('./routes/ticketRoute');
const userRoutes = require('./routes/userRoute');

const errorHandler = require('./middleware/errorHandler');


//for deault admin creation
const AdminModel = require('./models/adminModel');
const multiPassport = require('./middleware/multiPassport')();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
app.use(multiPassport.initialize());
app.use(express.static(process.cwd()));
mongoose.Promise = global.Promise;

mongoose.connect(mongooseConfig.url,mongooseConfig.options);

//make an admin if one does not exist
AdminModel.find({},async (error,data)=>{
    if(data.length==0){
        defaultAdmin = new AdminModel();
        defaultAdmin.firstName = "admin";
        defaultAdmin.lastName = "capstone";
        defaultAdmin.a_username = "admin";
        defaultAdmin.a_password = await defaultAdmin.encryptPassword("AdminCapstone");
        defaultAdmin.save();
        //console.log("Default admin added!");
    }
    //console.log(data.length);
});

app.use('/admin',adminRoutes);

app.use('/employee',employeeRoutes);

app.use('/order',orderRoutes);

app.use('/product',productRoutes);

app.use('/request',requestRoutes);

app.use('/ticket',ticketRoutes);

app.use('/user',userRoutes);

app.get('/',(req,res)=>{
	
	res.sendFile('index.html');
})

app.use(errorHandler);


app.listen(serverConfig.port,()=>console.log(`listening on port ${serverConfig.port}`));

module.exports = app;