import express from 'express';
import authenticate from '../middleware/authenticate.js';
const router = express.Router();
import Post from '../models/Post.js';
import User from '../models/User.js';


// CREATE A POST
router.post('/', authenticate, async (req, res) => {
    const newPost = new Post(req.body)

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status().json(error);
    }
})

// UPDATE A POST
// http://localhost:8000/api/posts/postID
router.put("/:id", authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // if user is accessing his post
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('post has been updated successfully');
        }
        else {
            res.status(500).json('you can only update your post')
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// DELETE A POST
// http://localhost:8000/api/posts/postID
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // if user is accessing his post
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
            res.status(200).json('post has been deleted successfully');
        }
        else {
            res.status(500).json('you can only delete your post')
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


// LIKE/DISLIKE A POST
router.put('/:id/like_dislike', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // if user has not liked post already
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json('post has been liked')
        }
        else // if user already liked than Dislike the post
        {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json('post has been disliked')
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})


// GET A POST
router.get('/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET TIMELINE POSTS
router.get('/timeline/:userId', authenticate, async (req, res) => {

    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });

        // fetch post of followings friends
        const friendsPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        // console.log(friendsPosts);

        res.status(200).json(userPosts.concat(...friendsPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET USER ALL POSTS
router.get('/profile/:username', authenticate, async (req, res) => {

    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;