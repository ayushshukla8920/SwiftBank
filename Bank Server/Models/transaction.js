const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    transactionId:{
        type: Number,
        required: true,
    },
    timestamp:{
        type: String,
        required: true,
    },
    accNo:{
        type: Number,
        required: true
    },
    accountName:{
        type: String,
        required: true
    },
    transactionMode:{
        type: String,
        required: true
    },
    transactionAmount:{
        type: Number,
        required: true
    }
})

const transaction = mongoose.model('Transactions',transactionSchema);

module.exports = transaction;