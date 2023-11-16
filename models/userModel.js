const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    secretQuestion: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "0"
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);