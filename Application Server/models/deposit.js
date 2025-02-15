const mongoose = require('mongoose');
const depositSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    orderid:{
        type: String,
        required: true,
        unique: true,
    },
    paymentid:{
        type: String,
        required: true,
        unique: true,
    },
    amount:{
        type: Number,
        required: true,
    }
});

const deposit = mongoose.model('deposit',depositSchema);

module.exports = deposit;