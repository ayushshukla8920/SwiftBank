const mongoose = require('mongoose');
const balanceSchema = new mongoose.Schema({
    customerId:{
        type: Number,
        required: true,
        unique: true
    },
    accBal:{
        type: Number,
        required: true,
    }
})

const balance = mongoose.model('balance',balanceSchema);

module.exports = balance;