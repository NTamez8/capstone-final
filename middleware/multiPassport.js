const passport = require('passport');
const passportJWT = require('passport-jwt');

const adminConfig = require('../config/adminConfig');
const userConfig = require('../config/userConfig');
const empConfig = require('../config/employeeConfig');

const ExtractJwt = passportJWT.ExtractJwt;

const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Emp = require('../models/employeeModel');

const Stratagy = passportJWT.Strategy;

const adminParams = {
    secretOrKey: adminConfig.secret,

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const userParams = {
    secretOrKey: userConfig.secret,

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const empParams = {
    secretOrKey: empConfig.secret,

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = ()=>{
    const adminStrategy = new Stratagy(adminParams, async (payload, done) => {
       
        const admin = await Admin.findById(payload.id);
        if (!admin) {
            return done(new Error("Admin not found"), null);
        } else
            return done(null, admin);
    });
    const userStrategy = new Stratagy(userParams, async (payload, done) => {
        
        const user = await User.findById(payload.id);
       
        if (!user) {
            return done(new Error("User not found"), null);
        } else
            return done(null, user);
    });
    const empStrategy = new Stratagy(empParams, async (payload, done) => {
        const emp = await Emp.findById(payload.id);
        if (!emp) {
            return done(new Error("Employee not found"), null);
        } else
            return done(null, emp);
    });
    passport.use('userAuth',userStrategy);
    passport.use('adminAuth',adminStrategy);
    passport.use('empAuth',empStrategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function (name) {
            return passport.authenticate(name, {
                session: false
            });
        }
    };
}