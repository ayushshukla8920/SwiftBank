const user = require('../models/user');
const axios = require('axios');
const BANKURL = process.env.BANKURL;

async function handleHomePage(req,res){
    const username = req.username;
    const result = await user.find({username: username})
    if(result.length > 0){
        if(!result[0].kycDone && !result[0].verified){
            return res.status(200).json({msg: "PENDING"});
        }
        if(!result[0].verified){
            return res.status(200).json({msg: "VERIFICATION"});
        }
    }
    else{
        return res.status(401).json({msg: "Something Went Wrong!!"})
    }
    const email = result[0].email;
    let BankDetails;
    let Bal;
    try{
        const response = await axios.get(`${BANKURL}/api/users/${email}`);
        if(response.data.message){
            return res.status(401).json({msg: "Something Went Wrong!!"})
        }
        BankDetails = response.data.response.result[0]
        Bal = response.data.response.balance[0];
    }
    catch(error){
        return res.status(401).json({msg: "Something Went Wrong!!"})
    }
    return res.status(200).json({
        username: result[0].username,
        name: result[0].name,
        dob: result[0].dateOfBirth,
        mobno: result[0].mobNo,
        email: result[0].email,
        gender: result[0].gender,
        kycDone: result[0].kycDone,
        verified: result[0].verified,
        BankDetails: BankDetails,
        Bal: Bal.accBal
    })
}
module.exports = {
    handleHomePage,
}