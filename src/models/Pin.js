const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Assuming user is referenced by ID
        ref: 'User', // Replace 'User' with your User model name if different
        // required: true,
    },
    tags: [{
        type: String,
    }],
    board: {
        type: mongoose.Schema.Types.ObjectId, // If board is referenced by ID
        ref: 'Board', // Replace 'Board' with your Board model name if you have one
        required: false, // Set to true if a board is required for every pin
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
