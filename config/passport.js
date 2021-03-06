require('dotenv').config();
// A passport strategy for authenticating with a JSON Web Token
// This allows to authenticate endpoints using a token
// const JwtStrategy = require('passport-jwt').Strategy;
// cont ExtractJwt = require('passport-jwt').ExtractJwt;
//destructure:
const { Strategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');

const { User } = require('../models/user');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
    // Add code here
    passport.use(new Strategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(error => {
            console.log('==========> Error below (passport.js)');
            console.log(error);
        })

    }))
}