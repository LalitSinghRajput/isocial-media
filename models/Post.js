import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array, // contains id's of users who liked the post
        default: []
    }
},
    { timestamps: true }
);

export default mongoose.model('Post', PostSchema);