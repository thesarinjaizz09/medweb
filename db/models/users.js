const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _username: {
        type: String,
        required: true,
        unique: true
    },
    _gender: {
        type: String,
        required: true
    },
    _address: {
        type: String,
        required: true
    },
    _number: {
        type: Number,
        required: true
    },
    _email: {
        type: String,
        required: true,
        unique: true
    },
    _password: {
        type: String,
        required: true
    }
})

const users = mongoose.model('users', userSchema);

module.exports = users;