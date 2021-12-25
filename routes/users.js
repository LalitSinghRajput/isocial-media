import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import bycrypt from 'bcrypt';
import authenticate from '../middleware/authenticate.js';


// UPDATE USER
// http://localhost:8000/api/users/id
router.put('/:id', authenticate, async (req, res) => {
    // if it is user account or if it is admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // if update password
        if (req.body.password) {
            try {
                const salt = await bycrypt.genSalt(10);
                req.body.password = await bycrypt.hash(req.body.password, salt);
            } catch (error) {
                console.log('password not update')
                return res.status(500).json(error);
            }
        }

        // else want to update other informations
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('Account has been updated successfully')
        } catch (error) {
            console.log('not able to update')
            return res.status(500).json(error);
        }
    }
    else //* if it is not user's account and neither it is admin
    {
        return res.status(403).json('You can update only your account');
    }
})

// DELETE USER
// http://localhost:8000/api/users/id
router.delete('/:id', authenticate, async (req, res) => {
    // if it is user account or if it is admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted successfully')
        } catch (error) {
            console.log('not able to delete')
            return res.status(500).json(error);
        }
    }
    else //* if it is not user's account and neither it is admin
    {
        return res.status(403).json('You can delete only your account');
    }
})

// GET A USER --->> either by username or userId
router.get('/', authenticate, async (req, res) => {
    // if we do this then we can pass either userId or username
    const userId = req.query.userId;
    const username = req.query.username;

    // console.log(req.query);

    try {
        const user = userId
            ? await User.findById(userId) // if userId is passed as params
            : await User.findOne({ username: username }); // if username is passed as params

        // to prevent sending password and updatedAt
        const { password, updatedAt, ...other } = user._doc;
        // console.log(other);

        res.status(200).json(other);
    } catch (error) {
        // console.error(error.message);
        res.status(500).json(error);
    }
})

// get all users from database
router.get('/getallusers', async (req, res) => {
    try {

        await User.find({}, function (err, users) {
            if (err) {
                res.send('something went wrong')
                next();
            }
            res.json(users)
        })

    } catch (error) {
        console.log(error);
    }
})

// GET ALL friends/FOLLOWERS OF USER
router.get("/followers/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followers.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL follwings OF USER
router.get("/followings/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                //   console.log(friendId);
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
})

// FOLLLOW A USER
// http://localhost:8000/api/users/id/follow
router.put('/:id/follow', authenticate, async (req, res) => {
    // if both id is different
    if (req.body.userId !== req.params.id) {
        try {
            // currUser will follow user
            const currUser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);

            // if currUser is not following user
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currUser.updateOne({ $push: { followings: req.params.id } });

                res.status(200).json('user has been followed');
            }
            else {
                res.status(403).json('You are already following this user');
            }

        } catch (error) {

        }
    }
    else {
        res.status(403).json('You cant follow yourself');
    }
})

// UNFOLLOW A USER
// http://localhost:8000/api/users/id/follow
router.put('/:id/unfollow', authenticate, async (req, res) => {
    // if both id is different
    if (req.body.userId !== req.params.id) {
        try {
            // currUser will unfollow user
            const currUser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currUser.updateOne({ $pull: { followings: req.params.id } });

                res.status(200).json('user has been unfollowed');
            }
            else {
                res.status(403).json('You dont follow this user');
            }

        } catch (error) {

        }
    }
    else {
        res.status(403).json('You cant unfollow yourself');
    }
})

export default router;

