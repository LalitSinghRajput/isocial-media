import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import authenticate from './middleware/authenticate.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(cookieParser());


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// importing routes
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import conversationRoute from './routes/conversation.js';
import messageRoute from './routes/message.js';


dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
    console.log('Connected to MongoDB successfully');
})

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));

// }

app.use(express.static(path.join(__dirname, './client/build')));


//TODO MiddleWares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/message', messageRoute);


app.listen(port, () => {
    console.log(`Backend server is running at: http://localhost:${port}`);
});