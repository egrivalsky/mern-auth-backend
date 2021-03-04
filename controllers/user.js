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
            const newUser = new db.User({
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
    .catch(err => console.log('Error finding user:', err))
}

const login = async (req, res) => {
    console.log('=====> inside of /login');
    console.log('====> /login -> req.body');
    console.log(req.body);

    const foundUser = await db.User.findOne({ email: req.body.email});

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
        console.log(isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name
            }
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has ended, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                console.log('===> legit');
                console.log(legit);
                res.json({ success: true, token: `Bearer ${token}`, userData: legit});
            });

            
        } else {
            return res.status(400).json({message: 'Email or password is incorrect' });
        }
    } else {
        return res.status(400).json({message: 'User not found'})
    }
}

const profile = (req, res) => {
    console.log('======> Inside /profile');
    console.log(req.body);
    console.log('======> user');
    console.log(req.user);
    const { id, name, email } = req.user;
    res.json({id, name, email});
}

//Exports
module.exports = {
    test,
    register,
    login,
    profile,
}