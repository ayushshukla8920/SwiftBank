const user = require('../models/user');
const { sendVerifyOTP } = require('../middlewares/emailer');
const { storeOtp, otpSession, genSessionId, storeSession } = require('../middlewares/cAuth');

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
        storeOtp(req.body.username,otp);
        await sendVerifyOTP(body.email, otp);
        return res.status(200).json({ 
            msg: "OTP sent to your email. Please verify.", 
            email: body.email 
        });
    } catch (error) {
        console.error("Error in handleSignup:", error);
        next(error);
    }
}

async function verifyOtp(req, res) {
    const { otp } = req.body;
    const username = req.body.username;
    const otpData = otpSession[username];
    if (!otpData) {
        return res.status(400).json({ 
            error: "Session expired. Please start over."
        });
    }
    if (parseInt(otp, 10) !== otpData.otp) {
        return res.status(400).json({ 
            error: "Invalid OTP. Please try again.", 
            email: otpData.email 
        });
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
        storeSession(sessionId,username);
        res.cookie('sessionId', sessionId, { maxAge: 7200000 });
    } else {
        return res.status(200).send('Invalid Data');
    }
    delete otpSession[username];
    return res.status(200).json( {msg : "Success"})
}
module.exports = {
    handleSignup,
    verifyOtp,
};