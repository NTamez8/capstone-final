
const express = require('express');
const userController = require('../controllers/userController');
const {hasAddress,hasDoB,hasEmail,hasFirstName,hasLastName,hasPassword,hasPhoneNo} = require('../validators/userValidators') ;
const userAuth = require('../middleware/multiPassport')()
const routes = express.Router();

routes.get('/getAll',userController.getAll);

routes.get('/getMe',userAuth.authenticate('userAuth'),userController.getMe);

routes.post('/signUp',[hasAddress,hasDoB,hasEmail,hasFirstName,hasLastName,hasPassword,hasPhoneNo],userController.signUp);

routes.post('/signIn',userController.signIn);
routes.get('/isValid',userAuth.authenticate('userAuth'),userController.isValid);

//this will need to be changed to not use a route param
//routes.post("/addItemstoCart/:product_id",userController.addItemstoCart)
routes.post("/addItemstoCart",userAuth.authenticate('userAuth'),userController.addItemstoCart)
routes.post("/deleteItemsfromCart/:product_id",userController.deleteItemsfromCart)
routes.delete('/deleteItemsfromCart/:id',userAuth.authenticate('userAuth'),userController.deleteItemById);

routes.get("/viewItemsfromCart",userAuth.authenticate('userAuth'),userController.viewItemsfromCart)
routes.get("/checkoutCart",userAuth.authenticate('userAuth'),userController.checkoutCart)

routes.put('/updatestatusToUser',userController.updatestatusToUser)

routes.get("/checkFunds",userController.checkFunds)
routes.put("/updateProfile",userController.updateProfile)
routes.put("/updatePassword",userController.updatePassword)
routes.put("/updateFunds",userAuth.authenticate('userAuth'),userController.updateFunds)
routes.put("/unlockLockUser",userController.unlockLockUser)


module.exports = routes;