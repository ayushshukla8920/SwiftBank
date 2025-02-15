const {storeOTP,validateOTP,deleteOTP} = require('../middlewares/OTP');
const {storeSession,genSessionId} = require('../middlewares/sessions');
const user = require('../models/user');
const { sendLoginOTP } = require('../middlewares/emailer');
var bcrypt = require('bcryptjs');
const session = require('../models/sessions');

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
                return res.status(200).json({error: "Invalid Password !"});
            }
        }
        else{
            return res.status(200).json({error: "User Not Found !"});
        }
    })
    if(isLoginValid){
        try{
            const otp = Math.floor(100000 + Math.random() * 900000);
            sendLoginOTP(email, otp);
            const stored = await storeOTP(req.body.username,otp);
            if(stored != 'success'){
                return res.status(400).json({error: "Something went Wrong"});
            }
            return res.status(200).json({ 
                msg: "OTP sent to your email. Please verify.", 
                email: email
            });
        } catch (error) {
            console.error("Error in handleLogin:", error);
            return res.status(200).json({error: "Something went Wrong"});
        }
    }
}
async function verifyLoginOtp(req, res) {
    const otp = req.body.otp;
    const username = req.body.username;
    const validation = await validateOTP(username,otp);
    if(validation == 'invalid otp'){
        return res.status(200).json({error:'Invalid OTP'});
    }
    if(validation == 'failure'){
        return res.status(200).json({error: "Session Expired."});
    }
    const sessionResponse = await session.find({username});
    if(sessionResponse.length != 0){
        storeSession(sessionResponse[0].sessionId,username);
        return res.status(200).json( {msg : "Success",sessionId: sessionResponse[0].sessionId});
    }
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
    return res.status(200).json( {msg : "Success",sessionId});
}
module.exports = {
    handleLogin,
    verifyLoginOtp,
}