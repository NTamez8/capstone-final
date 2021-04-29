// const express = require('express');
// const employeeController = require('../controllers/employeeController');
// const adminAuth = require('../middleware/multiPassport')()
// const empAuth = require('../middleware/multiPassport')()
// const multiAuth = require('../middleware/multiPassport')()
// const {hasEmail,hasFirstName,hasLastName} = require('../validators/employeeValidator');
// const routes = express.Router();

// routes.get('/getAll',employeeController.getAll)
// routes.post('/signIn',employeeController.signIn);
// routes.post('/add',[multiAuth.authenticate('adminAuth'),hasFirstName,hasLastName,hasEmail],employeeController.addEmployee);

// routes.post('/add',[adminAuth.authenticate('adminAuth'),hasFirstName,hasLastName,hasEmail],employeeController.addEmployee);

// routes.delete('/delete/:id',adminAuth.authenticate('adminAuth'),employeeController.deleteEmployee);
// routes.put('/editPassword/:id',empAuth.authenticate('empAuth'),employeeController.editPassword)
// routes.delete('/delete/:id',multiAuth.authenticate('adminAuth'),employeeController.deleteEmployee);
// routes.put('/editPassword',multiAuth.authenticate('empAuth'),employeeController.editPassword)
// module.exports = routes;


const express = require('express');
const employeeController = require('../controllers/employeeController');
const multiAuth = require('../middleware/multiPassport')()
const {hasEmail,hasFirstName,hasLastName} = require('../validators/employeeValidator');
const routes = express.Router();

routes.get('/getAll',employeeController.getAll)
routes.post('/signIn',employeeController.signIn);
routes.post('/add',[multiAuth.authenticate('adminAuth'),hasFirstName,hasLastName,hasEmail],employeeController.addEmployee);



routes.post('/signIn',employeeController.signIn);

routes.delete('/delete/:id',multiAuth.authenticate('adminAuth'),employeeController.deleteEmployee);
routes.put('/editPassword',multiAuth.authenticate('empAuth'),employeeController.editPassword);
routes.get('/isValid',multiAuth.authenticate('empAuth'),employeeController.isValid);
module.exports = routes;