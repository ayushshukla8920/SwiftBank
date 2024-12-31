const balance = require('../Models/balance');

async function handleUserBalance(req,res){
    await balance.find({customerId: req.params.customerId})
    .then((result)=>{
        if(result.length>0){return res.status(200).json({balance: result[0].accBal})}
        else{return res.status(404).json({message: "No Such User available"})}
    })
    .catch(err=>{
        res.status(500).json({message: "Internal Server Error : ",err});
    })
}

module.exports = {
    handleUserBalance,
}