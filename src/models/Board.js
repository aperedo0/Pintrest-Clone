const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin',
        required: false
    }]
});

module.exports = mongoose.model('Board', boardSchema);
