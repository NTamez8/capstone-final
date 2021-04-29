const express = require('express');
const requestController = require('../controllers/requestController');
const routes = express.Router();

//GET
routes.get("/getRequestById/:request_id",requestController.getRequestById);
routes.get("/getAllRequests",requestController.getAllRequests);

//DELETE
routes.post("/deleteRequestById",requestController.deleteRequestById);

//POST
routes.post("/sendRequest",requestController.sendRequest);
routes.post("/resolveRequest",requestController.resolveRequest);


module.exports = routes;