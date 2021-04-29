const express = require('express');
const ticketController = require('../controllers/ticketController');
const routes = express.Router();


routes.get("/getDetailOfUser",ticketController.getDetailOfUser)
routes.get('/lockedUsers',ticketController.getLockedUsers);
routes.post("/raiseTicket",ticketController.raiseTicket)

module.exports = routes;