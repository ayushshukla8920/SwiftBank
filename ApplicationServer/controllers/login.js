const { genSessionId,storeSession,otpSession,storeOtp } = require('../middlewares/cAuth');
const user = require('../models/user');
const { sendLoginOTP } = require('../middlewares/emailer');
var bcrypt = require('bcryptjs');
async function handleLogin(req,res){
    var isLoginValid = false;
    var email = null;
    await user.find({username: req.body.username})
    .then(result=>{
        if (result.length>0){
            const pwres = bcrypt.compareSync(req.body.password, result[0].password);
            if(pwres===true){
                isLoginValid = true;
                email = result[0].email;
            }
            else{
                return res.status(400).json({error: "Invalid Password !"});
            }
        }
        else{
            return res.status(400).json({error: "User Not Found !"});
        }
    })
    if(isLoginValid){
        try{
            const otp = Math.floor(100000 + Math.random() * 900000);
            await sendLoginOTP(email, otp);
            storeOtp(req.body.username,otp);
            return res.status(200).json({ 
                msg: "OTP sent to your email. Please verify.", 
                email: email
            });
        } catch (error) {
            console.error("Error in handleLogin:", error);
            next(error);
        }
    }
}
async function verifyLoginOtp(req, res) {
    const { otp } = req.body;
    const username = req.body.username;
    const otpData = otpSession[username];
    if (!otpData) {
        return res.status(400).json({ 
            error: "Session expired. Please start over.",
        });
    }
    if (parseInt(otp, 10) !== otpData.otp) {
        return res.status(400).json({ 
            error: "Invalid OTP. Please try again.", 
            email: otpData.email 
        });
    }
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
    handleLogin,
    verifyLoginOtp,
}
