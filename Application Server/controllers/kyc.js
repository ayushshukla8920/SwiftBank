const kyc = require('../models/kyc');
const user = require('../models/user');
const {sessions} = require('../middlewares/cAuth')
const {storeKyc} = require('../middlewares/kyc');
async function handleKYCSubmit(req,res){
    const sessionCookie = req.cookies.sessionId;
    if(sessionCookie){
        if(sessions[sessionCookie]){
            const username = sessions[sessionCookie].data.username;
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
    }
    else{
        return res.status(401).json({msg : "Unauthorised"});
    }
}
module.exports = {
    handleKYCSubmit,
}