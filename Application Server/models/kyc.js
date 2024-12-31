const mongoose = require('mongoose');
const kycSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    pan:{
        type: String,
        required: true,
        unique: true,
    },
    aadhar:{
        type: Number,
        required: true,
        unique: true,
    },
    address:{
        type: String,
        required: true,
    },
    pinCode:{
        type: Number,
        required: true,
    },
    
});

const kyc = mongoose.model('kyc',kycSchema);

module.exports = kyc;