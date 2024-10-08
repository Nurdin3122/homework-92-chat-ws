import mongoose, { Schema } from 'mongoose';

const messagesSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Messages = mongoose.model('Messages', messagesSchema);

export default Messages;