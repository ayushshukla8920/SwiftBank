const BANKURL = process.env.BANKURL;
const axios = require('axios');

async function handleAccountVerification(req,res) {
    try {
        const type = req.body.type;
        if(type == 'UPI'){
            const mobNo = req.body.mobNo;
            const response = await axios.post(`${BANKURL}/api/transaction/verify`,{type,mobNo});
            if(response.data.user){
                return res.status(200).json({name: response.data.user.name});
            }
            else{
                return res.status(200).json({error: response.data.error});
            }
        }
        if(type == 'IMPS' || type == 'NEFT'){
            const accNo = req.body.accNo;
            const response = await axios.post(`${BANKURL}/api/transaction/verify`,{type,accNo});
            if(response.data.user){
                return res.status(200).json({name: response.data.user.name});
            }
            else{
                return res.status(200).json({error: response.data.error});
            }
        }
        else{
            return res.status(200).json({error: "Transaction type not Specified"})
        }
    } catch (error) {
        return res.status(200).json({error: "Something went wrong!!"})
    }
}

async function handlePayment(req,res) {
    try {
        const TrxResponse = await axios.post(`${BANKURL}/api/transaction`,{
            account: req.body.from,
            accNo: req.body.to,
            transactionMode: req.body.type,
            transactionAmount: req.body.amount
        })
        if(TrxResponse.data.error){
            return res.status(200).json({error: TrxResponse.data.error})
        }
        return res.status(200).json({reciept: TrxResponse.data.reciept});
    } catch (error) {
        console.error(error);
        return res.status(200).json({error: "Internal Server Error: "+error})
    }
}

async function getTransactionsByPage(req,res) {
    try {
        const TrxResponse = await axios.post(`${BANKURL}/api/transaction/get-by-page`,{
            customerId: req.body.cid,
            page: req.body.page,
        })
        if(TrxResponse.data.error){
            return res.status(200).json({error: TrxResponse.data.error})
        }
        return res.status(200).json(TrxResponse.data);
    } catch (error) {
        console.error(error);
        return res.status(200).json({error: "Internal Server Error: "+error})
    }
}
async function getLatest(req,res) {
    try {
        const TrxResponse = await axios.post(`${BANKURL}/api/transaction/getlatest`,{
            customerId: req.body.cid,
        })
        if(TrxResponse.data.error){
            return res.status(200).json({error: TrxResponse.data.error})
        }
        return res.status(200).json(TrxResponse.data);
    } catch (error) {
        console.error(error);
        return res.status(200).json({error: "Internal Server Error: "+error})
    }
}
async function getSevenDays(req,res) {
    try {
        const TrxResponse = await axios.post(`${BANKURL}/api/transaction/getsevendays`,{
            customerId: req.body.cid,
        })
        if(TrxResponse.data.error){
            return res.status(200).json({error: TrxResponse.data.error})
        }
        return res.status(200).json(TrxResponse.data);
    } catch (error) {
        console.error(error);
        return res.status(200).json({error: "Internal Server Error: "+error})
    }
}


module.exports = {
    handleAccountVerification,
    handlePayment,
    getTransactionsByPage,
    getLatest,
    getSevenDays,
}