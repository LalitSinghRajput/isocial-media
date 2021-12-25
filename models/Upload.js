import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
    imageName: String,
});

export default mongoose.model('uploadImage', uploadSchema);
