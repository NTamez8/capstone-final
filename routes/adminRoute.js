const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/multiPassport')()
const routes = express.Router();

//GET
routes.get("/isValid",adminAuth.authenticate('adminAuth'),adminController.isValid);
routes.get("/getMe",adminAuth.authenticate('adminAuth'),adminController.getMe);

//POST
routes.post("/signIn",adminController.signIn);

module.exports = routes;