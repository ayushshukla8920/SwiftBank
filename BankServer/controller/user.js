const user = require('../Models/user');
const balance = require('../Models/balance');
const { handleValidationChecks } = require('../Middlewares/Validation');
const date = new Date();

async function handleNewBalance(cID){
    await balance.create({
        customerId: cID,
        accBal: 0
    })
}

async function handleUserOnboarding(req,res){
    const body = req.body;
    var error = false;
    if(!body ||
        !body.name||
        !body.dateOfBirth||
        !body.mobNo||
        !body.email||
        !body.gender||
        !body.address||
        !body.pinCode||
        !body.panNo||
        !body.aadharNo||
        !body.accType
    ){
        return res.status(400).json({message: "All Fields are Required"});
    }
    var accNo = 6224500000+Math.floor(10000+Math.random()*90000);
    var customerId = Math.floor(1000000+Math.random()*9000000);
    const result = await handleValidationChecks(body);
    if(result!=1){
        return res.status(406).json({ message: result});
    }
    let userAvl = true;
    while(userAvl){
        await user.find({customerId: customerId})
        .then((result)=>{
            if(result.length>0){
                customerId = Math.floor(1000000+Math.random()*9000000);
            }
            else{userAvl = false}
        })
        await user.find({accNo: accNo})
        .then((result)=>{
            if(result.length>0){
                accNo = 6224500000+Math.floor(10000+Math.random()*90000);
            }
            else{userAvl = false}
        })
    }
    await user.create({
        accNo: accNo,
        customerId: customerId,
        name: body.name,
        dateOfBirth: body.dateOfBirth,
        mobNo: body.mobNo,
        email: body.email,
        gender: body.gender,
        address: body.address,
        pinCode: body.pinCode,
        panNo: body.panNo,
        aadharNo: body.aadharNo,
        dateOfAccOpen: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
        accType: body.accType,
        accStatus: 'ACTIVE',
    }).catch(err=>{
        if(err){
            error = err;
            return res.status(400).json({ message: "Account Already Exists..." });
        }
    })
    const Account = await user.find({email: body.email});
    if(!error){
        handleNewBalance(customerId);
        return res.status(201).json({ message: "Success",Account: Account});
    }
}

async function handleGetUserDetails(req,res){
    const id = req.params.email;
    try{
        const result = await user.find({email: id})
        if(result.length>0){
            const userbalance = await balance.find({customerId: result[0].customerId});
            const response = {
                result: result,
                balance: userbalance
            }
            return res.status(200).json({response});
        }
        else{
            return res.status(400).json({message: "No User Found"})
        }
    }
    catch (err){
        res.status(500).json({message: "Internal Server Error : ",err});
    }
}

module.exports = {
    handleUserOnboarding,
    handleGetUserDetails,
}