const fs = require('fs');
const path = require('path');
const user = require('../models/user');
const kycModel = require('../models/kyc');
const axios = require('axios');
const { sendWelcomeEmail } = require('./emailer');
const sessionsFilePath = path.join(__dirname, '../session/kyc.json');
kyc={}
const BANKURL = process.env.BANKURL;

async function handleAccountCreation(username){
    const userData = await user.find({username: username});
    const kycData = await kycModel.find({username: username});
    const response = await axios.post(`${BANKURL}/api/users`,{
        name: userData[0].name,
        dateOfBirth: userData[0].dateOfBirth,
        mobNo: userData[0].mobNo,
        email: userData[0].email,
        gender: userData[0].gender,
        address: kycData[0].address,
        pinCode: kycData[0].pinCode,
        panNo: kycData[0].pan,
        aadharNo: kycData[0].aadhar,
        accType: 'SAVINGS'
    })
    const Account = response.data.Account[0];
    sendWelcomeEmail(userData[0].email,Account);
}

function loadKycFromFile() {
    if (fs.existsSync(sessionsFilePath)) {
        const data = fs.readFileSync(sessionsFilePath, 'utf8');
        try {
            kyc = JSON.parse(data);
        } catch (error) {
        }
    }
}
function saveKycToFile() {
    const directory = path.dirname(sessionsFilePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(sessionsFilePath, JSON.stringify(kyc, null, 2), 'utf8');
}
function startKycCleanup() {
    setInterval(() => {
        const now = Date.now();
        for (const username in kyc) {
            if (kyc[username].expires < now) {
                user.findOneAndUpdate({username: username},{$set: {verified: true}})
                .then(()=>{
                    handleAccountCreation(username);
                    delete kyc[username];
                    fs.writeFileSync(sessionsFilePath, JSON.stringify(kyc, null, 2), 'utf8');
                })
            }
        }
    }, 150);
}
function storeKyc(username) {
    const expiration = Date.now() + 10000;
    kyc[username] = { expires: expiration };
    saveKycToFile();
}
loadKycFromFile();
module.exports={
    startKycCleanup,
    saveKycToFile,
    loadKycFromFile,
    storeKyc,
    kyc,
}