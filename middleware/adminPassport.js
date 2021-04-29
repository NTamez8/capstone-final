const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../config/adminConfig');

const ExtractJwt = passportJWT.ExtractJwt;

const Admin = require('../models/adminModel');

const Stratagy = passportJWT.Strategy;

const params = {
    secretOrKey: config.secret,

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = ()=>{
    const strategy = new Stratagy(params, async (payload, done) => {
        const admin = await Admin.findById(payload.id);
        if (!admin) {
            return done(new Error("Admin not found"), null);
        } else
            return done(null, admin);
    });
    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", {
                session: false
            });
        }
    };
}