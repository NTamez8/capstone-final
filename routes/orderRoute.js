const express = require('express');
const orderController = require('../controllers/orderController');
const userAuth = require('../middleware/multiPassport')()
const routes = express.Router();

routes.get("/retriveOrderById/",orderController.getOrderById)
routes.put("/updateOrderStatus",orderController.updateOrderByStatus)

routes.get('/getOrdersByCust/:id',orderController.getOrdersByCust);
routes.get('/getOrderByProdId/:id',orderController.getOrdersByProduct);
routes.post('/getOrderByMonth',orderController.getOrdersByMonth);
routes.post('/getOrderByWeek',orderController.getOrdersByWeek);
routes.post('/getOrderByDay',orderController.getOrdersByDay);
//routes.get("/retriveOrderById/:_id",orderController.getOrderById)
//routes.put("/updateOrderStatus",orderController.updateOrderByStatus)
// routes.get("/storeOrderStatus",orderController.storeOrderByStatus)
//routes.get("/updateProductStatus",orderController.updateOrderByStatus)
routes.get("/getorderstatus",orderController.getorderstatusToUser)
routes.get('/getUserOrder',userAuth.authenticate('userAuth'),orderController.getUserOrder)

module.exports = routes;