const axios = require('axios');
const BANKURL = process.env.BANKURL;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const deposit = require('../models/deposit');
async function handleGenerateOrderID(req,res){
    try{
        const razorpay = new Razorpay({key_id: process.env.RAZORPAY_KEY,key_secret: process.env.RAZORPAY_SECRET,});
        const options = {
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: req.body.receipt
        }
        const order = await razorpay.orders.create(options);
        if(!order){
            return res.status(500).json({error: "Internal Server Error"});
        }
        return res.status(200).json(order);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: "Something went wrong!"});
    }
}

async function handleDepositValidation(req,res){
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, username, amount,account } = req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if(digest!==razorpay_signature){
        return res.stats(400).json({msg: "Transaction is not Legit!" })
    }
    let transactionResponse;
    try{
        await deposit.create({
            username: username,
            orderid: razorpay_order_id,
            paymentid: razorpay_payment_id,
            amount: amount
        })
        transactionResponse = await axios.post(`${BANKURL}/api/transaction/deposit`,{
            transactionAmount: amount,
            account: account
        });
    }
    catch(error){
        return res.status(400).json({msg: "Something went Wrong!",error: error });
    }
    if(transactionResponse.data.message == 'Success'){
        return res.status(200).json({msg: "Success", razorpay_order_id, razorpay_payment_id});
    }
    else{
        return res.status(400).json({msg: "Something went Wrong!"});
    }
}

module.exports = {
    handleDepositValidation,
    handleGenerateOrderID,
}