const Session = require('../models/sessions');
function genSessionId(){
    const sessionId = 'session.' + 100000+Math.floor(Math.random()*900000);
    return sessionId;
}
async function storeSession(sessionId,username) {
    try {
        const expiresAt = new Date(Date.now() + 30 * 60000);
        await Session.findOneAndUpdate(
            { sessionId },
            { username, expiresAt },
            { upsert: true, new: true }
        );
        return 'success';
    } catch (error) {
        console.error("Error storing OTP:", error);
        return 'failure';
    }
}
async function deleteSession(sessionId) {
    try {
        await Session.findOneAndDelete({sessionId});
        return 'success';
    } catch (error) {
        console.error("Error deleting Session:", error);
        return 'failure';
    }
}
async function validateSession(req,res,next) {
    if(req.body.sessionId){
        try {
            const response = await Session.find({ sessionId: req.body.sessionId });
            if(response.length == 0){
                return res.status(200).json({error: "Unauthorised"});
            }
            req.username = response[0].username;
            next();
        } catch (error) {
            console.error("Error finding session:", error);
            return res.status(200).json({error: "Unauthorised"});
        }
    }
}
module.exports = {
    genSessionId,
    storeSession,
    validateSession,
    deleteSession,
}