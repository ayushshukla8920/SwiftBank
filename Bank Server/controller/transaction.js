const transaction = require('../Models/transaction');
const balance = require('../Models/balance');
const user = require('../Models/user');
const { handleAccountStatus } = require('../Middlewares/checkAccountStatus');


async function handleDepositTransaction(req,res){
    const date = new Date();
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
            timestamp: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
            accNo: accNo,
            accountName: accountName,
            transactionMode: transactionMode.toUpperCase(),
            transactionAmount: transactionAmount
        })
    }
    return res.status(200).json({message: "Success"});
}

async function handleCreditTransaction(account,accNo,transactionMode,transactionAmount,transactionId){
    const date = new Date();
    const benefciaryresult = await user.find({accNo: accNo})
    const userresult = await user.find({accNo: account})
    if(userresult.length==0){
        return "No Such Account";
    }
    const customerId = userresult[0].customerId;
    const accountName = benefciaryresult[0].name;
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
            timestamp: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
            accNo: accNo,
            accountName: accountName,
            transactionMode: transactionMode.toUpperCase(),
            transactionAmount: transactionAmount
        })
    }
    return 0;
}

async function handleTransaction(req,res){
    const date = new Date();
    const body  = req.body;
    if(!body || !body.account || !body.accNo || !body.transactionMode || !body.transactionAmount){
        return res.status(200).json({error: "Invalid Request"});
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
    var benefciaryresult;
    if(body.transactionMode == 'UPI'){
        benefciaryresult = await user.find({mobNo: body.accNo})
    }
    else{
        benefciaryresult = await user.find({accNo: body.accNo})
    }
    const userresult = await user.find({accNo: body.account})
    if(userresult.length==0){
        return res.status(200).json({error: "No Such Account"})
    }
    if(userresult[0].accNo == benefciaryresult[0].accNo){
        return res.status(200).json({error: "You can't send money to your own Account."})
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
        return res.status(200).json({error: "User account is Blocked or Inactive"});
    }
    const accountName = benefciaryresult[0].name;
    const balresult = await balance.find({customerId: customerId});
    if(balresult.length == 0){
        return res.status(200).json({error: "No Such Account"})
    }
    const initialBal = balresult[0].accBal;
    if(initialBal < body.transactionAmount){
        return res.status(200).json({error: "Insufficient Balance"})
    }
    const finalBal = initialBal - body.transactionAmount;
    var balanceerror = false;
    await balance.updateOne({customerId: customerId},{$set: {accBal: finalBal}})
    .catch(err=>{
        balanceerror = true;
    })
    handleCreditTransaction(benefciaryresult[0].accNo,body.account,body.transactionMode,body.transactionAmount,transactionId)
    .then((result)=>{
        if(!result){
            balanceerror = true;
        }
    })
    if(balanceerror){
        await balance.updateOne({customerId: customerId},{$set: {accBal: initialBal}})
        return res.status(200).json({error: "Transaction Failed"});
    }
    else{
        await transaction.create({
            customerId: customerId,
            type: "Debit",
            transactionId: transactionId,
            timestamp: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
            accNo: body.accNo,
            accountName: accountName,
            transactionMode: body.transactionMode.toUpperCase(),
            transactionAmount: body.transactionAmount
        })
    }
    const reciept = await transaction.findOne({transactionId});
    return res.status(200).json({reciept: reciept});
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

async function handleAccountVerification(req,res){
    try {
        const type = req.body.type;
        if(type == 'UPI'){
            const mobNo = req.body.mobNo;
            const userResponse = await user.find({mobNo});
            if(userResponse.length ==0){
                return res.status(200).json({error: "Invalid UPI ID"});
            }
            return res.status(200).json({user: userResponse[0]});
        }
        if(type == 'IMPS' || type == 'NEFT'){
            const accNo = req.body.accNo;
            const mobNo = req.body.mobNo;
            const userResponse = await user.find({accNo});
            if(userResponse.length ==0){
                return res.status(200).json({error: "Invalid Account Number"});
            }
            return res.status(200).json({user: userResponse[0]});
        }
        else{
            return res.status(200).json({error: "Transaction type not Specified"});
        }
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
}

async function getPageWiseTransactions(req,res) {
    try {
        let page = req.body.page;
        let customerId = req.body.customerId;
        let limit = 10;
        page = parseInt(page);
        limit = parseInt(limit);
        const transactions = await transaction.find({customerId})
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalTransactions = await transaction.countDocuments({customerId});
        res.json({
            totalTransactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getRecentTransactions(req,res) {
    try {
        let page = 1;
        let customerId = req.body.customerId;
        let limit = 5;
        page = parseInt(page);
        limit = parseInt(limit);
        const transactions = await transaction.find({customerId})
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getSevenDays(req, res) {
    try {
        const customerId = req.body.customerId;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const transactions = await transaction.find({ customerId }).lean();
        const last7DaysTransactions = transactions.filter((tx) => {
            const [time, date] = tx.timestamp.split("-");
            const [day, month, year] = date.split("/").map(Number);
            const transactionDate = new Date(year, month-1, day);
            return transactionDate >= sevenDaysAgo;
        });
        res.json(last7DaysTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {
    handleTransaction,
    handleTransactionHistory,
    handleDepositTransaction,
    handleAccountVerification,
    getPageWiseTransactions,
    getRecentTransactions,
    getSevenDays,
};