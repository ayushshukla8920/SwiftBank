const express = require('express');
const router = express.Router();
const { handleTransaction, handleTransactionHistory, handleDepositTransaction } = require('../controller/transaction');

router.post('/',handleTransaction);

router.get('/:customerId',handleTransactionHistory);

router.post('/deposit',handleDepositTransaction);

module.exports = router;