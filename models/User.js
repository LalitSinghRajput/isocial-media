import mongoose from 'mongoose'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const jwtSecret = process.env.TOKEN_SECRET;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,// contains id's of users who are followers of the user
        default: []
    },
    followings: {
        type: Array,// contains id's of users whom user is following
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    },
},
    { timestamps: true }
);

// function to generate token
UserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, jwtSecret);
        this.tokens = this.tokens.concat({ token: token });
        // await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

export default mongoose.model('User', UserSchema);