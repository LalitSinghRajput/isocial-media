import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.TOKEN_SECRET;


// middleware to authenticate user using jwt auth token
const authenticate = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["authToken"] || req.cookies.authToken;

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }

        const verifyToken = jwt.verify(token, jwtSecret);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            throw new Error("User not found")
        }

        // req.token = token;
        // req.rootUser = rootUser;
        // req.userId = rootUser._id;

        next();

    } catch (error) {
        return res.status(401).send("Unhatorized: Invalid token");
    }

}



export default authenticate;