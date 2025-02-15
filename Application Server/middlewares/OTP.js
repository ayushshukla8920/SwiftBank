const OTP = require('../models/otp');

async function storeOTP(username, code) {
    try {
        const expiresAt = new Date(Date.now() + 5 * 60000);
        await OTP.findOneAndUpdate(
            { username },
            { otp: code, expiresAt },
            { upsert: true, new: true }
        );
        return 'success';
    } catch (error) {
        console.error("Error storing OTP:", error);
        return 'failure';
    }
}

async function validateOTP(username, code) {
    try {
        const response = await OTP.find({username});
        if(response.length == 0){
            return 'failure';
        }
        if(response[0].otp == code){
            return 'success';
        }
        else{
            return 'invalid otp';
        }
    } catch (error) {
        console.error("Error storing OTP:", error);
        return 'failure';
    }
}

async function deleteOTP(username) {
    try {
        const response = await OTP.find({username});
        if(response.length == 0){
            return 'failure';
        }
        else{
            await OTP.findOneAndDelete({username});
            return 'success';
        }
    } catch (error) {
        console.error("Error deleting OTP:", error);
        return 'failure';
    }
}

module.exports = {
    storeOTP,
    validateOTP,
    deleteOTP,
};
