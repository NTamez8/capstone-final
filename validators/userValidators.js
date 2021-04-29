const {body} = require('express-validator');

exports.hasFirstName = body("firstName").exists().withMessage("Must have a first name");

exports.hasLastName = body("lastName").exists().withMessage("Must have a last name");

exports.hasEmail = body("u_username").isEmail().withMessage("Must have a email");

exports.hasPassword = body("u_password").exists().withMessage("Must have a password");

exports.hasDoB = body("date_of_birth").isDate().withMessage("Must have a Date of birth");

exports.hasPhoneNo = body("phone_number").exists().withMessage("Must have a phone number");

exports.hasAddress = body("address").exists().withMessage("Must have an address");