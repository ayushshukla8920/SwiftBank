const express = require('express');
const router = express.Router();
const { handleTransaction, handleTransactionHistory, handleDepositTransaction, handleAccountVerification, getPageWiseTransactions, getRecentTransactions, getSevenDays, } = require('../controller/transaction');

router.post('/',handleTransaction);

router.get('/:customerId',handleTransactionHistory);

router.post('/deposit',handleDepositTransaction);

router.post('/verify',handleAccountVerification);

router.post('/get-by-page',getPageWiseTransactions);

router.post('/getlatest',getRecentTransactions);

router.post('/getsevendays',getSevenDays);

module.exports = router;