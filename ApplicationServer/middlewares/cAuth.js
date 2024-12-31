const fs = require('fs');
let sessions = {};
let otpSession = {};
const path = require('path');
const sessionsFilePath = path.join(__dirname, '../session/session.json');
function saveSessionsToFile() {
    const directory = path.dirname(sessionsFilePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf8');
}
function genSessionId(){
    const sessionId = 'session.' + 100000+Math.floor(Math.random()*900000);
    return sessionId;
}
function storeSession(sessionId, username) {
    const expiration = Date.now() + 7200000;
    sessions[sessionId] = { data: { username: username || 'Anonymous' }, expires: expiration };
}
function storeOtp(username,otp){
    otpSession[username]={otp: otp};
}
function startSessionCleanup() {
    setInterval(() => {
        const now = Date.now();
        for (const sessionId in sessions) {
            if (sessions[sessionId].expires < now) {
                delete sessions[sessionId];
                fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf8');
            }
        }
    }, 15000);
}
function deleteSession(sessionId) {
    if (sessions[sessionId]) {
        delete sessions[sessionId];
    }
}
module.exports = { 
    startSessionCleanup,
    genSessionId,
    storeSession,
    storeOtp,
    deleteSession,
    sessions,
    otpSession
};
