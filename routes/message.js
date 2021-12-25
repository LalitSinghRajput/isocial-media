import express from 'express';
import authenticate from '../middleware/authenticate.js';
const router = express.Router();
import Message from '../models/Message.js'

// add
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);

    } catch (error) {
        res.status(500).json(error);
    }
})


// get all messages
router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;