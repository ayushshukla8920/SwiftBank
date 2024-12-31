const transaction = require('../Models/transaction');
const balance = require('../Models/balance');
const user = require('../Models/user');
const { handleAccountStatus } = require('../Middlewares/checkAccountStatus');
const date = new Date();

async function handleDepositTransaction(req,res){
    const {transactionAmount, account} = req.body;
    const transactionMode = "Online-PG";
    const accNo = 1000000999;
    var transactionId = Math.floor(10000000000000+Math.random()*900000000000000);
    let trxnAvl = true;
    while(trxnAvl){
        await transaction.find({transactionId: transactionId})
        .then((result)=>{
            if(result.length>0){
                transactionId = Math.floor(10000000000000+Math.random()*900000000000000);
            }
            else{trxnAvl = false}
        })
    }
    const userresult = await user.find({accNo: account})
    if(userresult.length==0){
        return res.status(400).json({message: "No Such Account"})
    }
    const customerId = userresult[0].customerId;
    const accountName = "Deposit via Online-PG";
    const balresult = await balance.find({customerId: customerId});
    if(balresult.length == 0){
        return res.status(400).json({message: "No Such Account"})
    }
    const initialBal = balresult[0].accBal;
    const finalBal = Number(initialBal) + Number(transactionAmount);
    var balanceerror = false;
    await balance.updateOne({customerId: customerId},{$set: {accBal: finalBal}})
    .catch(err=>{
        balanceerror = err;
    })
    if(balanceerror){
        await balance.updateOne({customerId: customerId},{$set: {accBal: initialBal}})
        return res.status(400).json({messgae: "Transaction Failed"});
    }
    else{
        await transaction.create({
            customerId: customerId,
            type: "DEPOSIT",
            transactionId: transactionId,
            timestamp: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            accNo: accNo,
            accountName: accountName,
            transactionMode: transactionMode.toUpperCase(),
            transactionAmount: transactionAmount
        })
    }
    return res.status(200).json({message: "Success"});
}


async function handleCreditTransaction(account,accNo,transactionMode,transactionAmount,transactionId){
    const benefciaryresult = await user.find({accNo: accNo})
    const userresult = await user.find({accNo: account})
    if(userresult.length==0){
        return "No Such Account";
    }
    const customerId = userresult[0].customerId;
    const accountName = benefciaryresult[0].firstName + " " + benefciaryresult[0].lastName;
    const balresult = await balance.find({customerId: customerId});
    if(balresult.length == 0){
        return "No Such Account";
    }
    const initialBal = balresult[0].accBal;
    const finalBal = Number(initialBal) + Number(transactionAmount);
    var balanceerror = false;
    await balance.updateOne({customerId: customerId},{$set: {accBal: finalBal}})
    .catch(err=>{
        balanceerror = err;
    })
    if(balanceerror){
        await balance.updateOne({customerId: customerId},{$set: {accBal: initialBal}})
        return "Transaction Failed";
    }
    else{
        await transaction.create({
            customerId: customerId,
            type: "Credit",
            transactionId: transactionId,
            timestamp: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            accNo: accNo,
            accountName: accountName,
            transactionMode: transactionMode.toUpperCase(),
            transactionAmount: transactionAmount
        })
    }
    return 0;
}

async function handleTransaction(req,res){
    const body  = req.body;
    if(!body || !body.account || !body.accNo || !body.transactionMode || !body.transactionAmount){
        return res.status(404).json({message: "Invalid Request"});
    }
    var transactionId = Math.floor(10000000000000+Math.random()*900000000000000);
    let trxnAvl = true;
    while(trxnAvl){
        await transaction.find({transactionId: transactionId})
        .then((result)=>{
            if(result.length>0){
                transactionId = Math.floor(10000000000000+Math.random()*900000000000000);
            }
            else{trxnAvl = false}
        })
    }
    const benefciaryresult = await user.find({accNo: body.accNo})
    const userresult = await user.find({accNo: body.account})
    if(userresult.length==0){
        return res.status(404).json({message: "No Such Account"})
    }
    const customerId = userresult[0].customerId;
    var activeresult = 1;
    await handleAccountStatus(customerId)
    .then(result=>{
        if(result == 0 ){
            activeresult = 0;
        }
    })
    if(activeresult == 0){
        return res.status(406).json({message: "User account is Blocked or Inactive"});
    }
    const accountName = benefciaryresult[0].firstName + " " + benefciaryresult[0].lastName;
    const balresult = await balance.find({customerId: customerId});
    if(balresult.length == 0){
        return res.status(404).json({message: "No Such Account"})
    }
    const initialBal = balresult[0].accBal;
    if(initialBal < body.transactionAmount){
        return res.status(422).json({message: "Insufficient Balance"})
    }
    const finalBal = initialBal - body.transactionAmount;
    var balanceerror = false;
    await balance.updateOne({customerId: customerId},{$set: {accBal: finalBal}})
    .catch(err=>{
        balanceerror = true;
    })
    handleCreditTransaction(body.accNo,body.account,body.transactionMode,body.transactionAmount,transactionId)
    .then((result)=>{
        if(!result){
            balanceerror = true;
        }
    })
    if(balanceerror){
        await balance.updateOne({customerId: customerId},{$set: {accBal: initialBal}})
        return res.status(400).json({message: "Transaction Failed"});
    }
    else{
        await transaction.create({
            customerId: customerId,
            type: "Debit",
            transactionId: transactionId,
            timestamp: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            accNo: body.accNo,
            accountName: accountName,
            transactionMode: body.transactionMode.toUpperCase(),
            transactionAmount: body.transactionAmount
        })
    }
    return res.status(200).json({message: "Trxn Success"})
}

async function handleTransactionHistory(req,res){
    await transaction.find({customerId: req.params.customerId})
    .then((result)=>{
        if(result.length>0){return res.status(200).json(result)}
        else{return res.status(404).json({message: "No Transactions Available for User OR Invalid User Id"})}
    })
    .catch(err=>{
        res.status(500).json({message: "Internal Server Error : ",err});
    })
}

module.exports = {
    handleTransaction,
    handleTransactionHistory,
    handleDepositTransaction,
};