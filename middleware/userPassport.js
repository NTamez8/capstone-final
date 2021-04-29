const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../config/userConfig');

const ExtractJwt = passportJWT.ExtractJwt;

const User = require('../models/userModel');

const Stratagy = passportJWT.Strategy;

const params = {
    secretOrKey: config.secret,

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = ()=>{
    const strategy = new Stratagy(params, async (payload, done) => {
        const user = await User.findById(payload.id);
        if (!user) {
            return done(new Error("User not found"), null);
        } else
            return done(null, user);
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