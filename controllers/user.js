require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const db = require('../models');
const { User } = require('../models');

const test = (req, res) => {
    res.json({ message: 'User endpoint OK! 🌮' });
}

const register = (req, res) => {
    console.log('=====> inside of /register');
    console.log('====> req.body');
    console.log(req.body);

    db.User.findOne({email: req.body.email})
    .then(user => {
        if (user) {
            return res.status(400).json({ message: 'email already exists' })
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log('=====> Error inside of hash', err);

                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));

                })
            })

        }
    })
}

//Exports
module.exports = {
    test,
}