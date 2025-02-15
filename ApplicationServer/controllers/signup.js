const user = require('../models/user');
const { sendVerifyOTP } = require('../middlewares/emailer');
const {storeOTP,validateOTP,deleteOTP} = require('../middlewares/OTP');
const {storeSession,genSessionId} = require('../middlewares/sessions');

async function handleSignup(req, res, next) {
    try {
        const body = req.body;
        const usernameExists = await user.findOne({ username: body.username });
        if (usernameExists) {
            return res.status(400).json({ error: "This Username is already taken!"});
        }
        const mobNoExists = await user.findOne({ mobNo: body.mobno });
        if (mobNoExists) {
            return res.status(400).json({ error: "Mobile number already linked with another account!"});
        }
        const emailExists = await user.findOne({ email: body.email });
        if (emailExists) {
            return res.status(400).json({ error: "Email already linked with another account!"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        storeOTP(req.body.username,otp);
        await sendVerifyOTP(body.email, otp);
        return res.status(200).json({ 
            msg: "OTP sent to your email. Please verify.", 
            email: body.email 
        });
    } catch (error) {
        console.error("Error in handleSignup:", error);
        return res.status(200).json({error: "Something went Wrong"});
    }
}

async function verifyOtp(req, res) {
    const otp = req.body.otp;
    const username = req.body.username;
    const validation = validateOTP(username,otp);
    if(validation == 'invalid otp'){
        return res.status(200).json({error:'Invalid OTP'});
    }
    if(validation == 'failure'){
        return res.status(200).json({error: "Session Expired."});
    }
    const userData = req.body;
    await user.create({
        username: userData.username,
        password: userData.password,
        name: userData.name,
        dateOfBirth: userData.dob,
        mobNo: userData.mobno,
        email: userData.email,
        gender: userData.gender,
        kycDone: false,
        verified: false,
    });
    const sessionId = genSessionId();
    if (sessionId) {
        try{
            storeSession(sessionId,username);
        }
        catch(error){
            return res.status(200).json({error: "Something went Wrong"});
        }
    } else {
        return res.status(200).send('Invalid Data');
    }
    deleteOTP(username);
    return res.status(200).json( {msg : "Success", sessionId})
}
module.exports = {
    handleSignup,
    verifyOtp,
};