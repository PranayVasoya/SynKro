import mongoose from 'mongoose';
import { ref } from 'process';

const messageSchema =  new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const chatRoomSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    }],
    messages: [messageSchema],
});

export default mongoose.models.ChatRoom || mongooge.model("ChatRoom");