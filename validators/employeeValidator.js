const {body} = require('express-validator');

exports.hasFirstName = body("firstName").exists().withMessage("Must have a firstname");

exports.hasLastName = body("lastName").exists().withMessage("Must have a last name");

exports.hasEmail = body("email_address").isEmail().withMessage("Must contain a valid email");