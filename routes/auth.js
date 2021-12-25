import express, { json } from 'express';
const router = express.Router();
import User from '../models/User.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.TOKEN_SECRET;

import { registerValidation } from '../validation.js'
import authenticate from '../middleware/authenticate.js';

// REGISTER
// http://localhost:8000/api/auth/register
router.post('/register', async (req, res) => {

    // let validate the data before adding a user
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
        return res.status(400).send("Email already exists");
    }

    try {
        // generate new hased password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword

        });

        // save user
        const user = await newUser.save();

        // const data = { user: user._id };

        const token = await user.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
    }
});

// LOGIN
// http://localhost:8000/api/auth/login
router.post('/login', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check email doesn't exist
    const user = await User.findOne({ email: req.body.email });

    let token;

    try {
        // if user doesn't exist with specified email
        if (!user)
            res.status(404).json('User not found');

        const validPassword = await bycrypt.compare(req.body.password, user.password)

        // if password is wrong
        if (!validPassword)
            res.status(404).json("Incorrect Password")

        // all things are good than  create and assign a token

        token = await user.generateAuthToken();
        console.log(token);

        // store authToken in cookie
        // cookie will get expire in 30 days
        res.cookie("authToken", token, {
            expires: new Date(Date.now() + 2.592e+9),
            httpOnly: true,

        });

        // valid user with correct password
        res.status(200).json(user);

    } catch (error) {
        res.status(504).json(error);
    }
})

// LOGOUT 
// http://localhost:8000/api/auth/logout
router.get("/logout", authenticate, async (req, res) => {
    try {
        // remove cookie authToken
        res.clearCookie('authToken', { path: '/' });
        res.clearCookie('user', { path: '/' });

        await req.rootUser.save();

    } catch (error) {
        res.status(500).send(error);
    }
})


// fetchUser get loggedin user details using: POST "/api/auth/getuser" -->> login required
router.post('/getuser', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error Occured');
    }
})

export default router;

