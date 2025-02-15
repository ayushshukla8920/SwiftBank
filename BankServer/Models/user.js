const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    accNo: {
        type: Number,
        required: true,
        unique: true,
    },
    customerId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    dateOfBirth:{
        type: String,
        required: true,
    },
    mobNo: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    pinCode:{
        type: Number,
        required: true,
    },
    panNo:{
        type: String,
        required: true,
        unique: true,
    },
    aadharNo:{
        type: Number,
        required: true,
        unique: true,
    },
    dateOfAccOpen:{
        type: String,
        required: true,
    },
    accType:{
        type: String,
        required: true,
    },
    accStatus:{
        type: String,
        required: true,
    }
})

const user = mongoose.model('user',userSchema);

module.exports = user;