const kyc = require('../models/kyc');
const user = require('../models/user');
const {storeKyc} = require('../middlewares/kyc');
async function handleKYCSubmit(req,res){
    const username = req.username;
    try{
        await kyc.create({
            username: username,
            pan: req.body.pan,
            aadhar: req.body.aadhar,
            address: req.body.address,
            pinCode: req.body.pin
        })
        await user.findOneAndUpdate({username: username},{$set: {kycDone: true}});
        storeKyc(username);
        return res.status(201).json({msg: "KYC Submitted Successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: err});
    }
}
module.exports = {
    handleKYCSubmit,
}