const express = require('express');
const productController = require('../controllers/productController');
const multiPassport = require('../middleware/multiPassport')()
const routes = express.Router();

//GET
routes.get("/getProductById/:product_id",productController.getProductById);
routes.get("/getAllProducts",productController.getAllProducts);

routes.post("/deleteProductById",multiPassport.authenticate('adminAuth'),productController.deleteProductById);

routes.post("/addProduct",multiPassport.authenticate('adminAuth'),productController.addProduct);
routes.post("/updateProductQuantityById",multiPassport.authenticate('adminAuth'),productController.updateProductQuantityById);

module.exports = routes;