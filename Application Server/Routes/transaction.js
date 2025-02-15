const express = require('express');
const { handleAccountVerification, handlePayment, getTransactionsByPage, getLatest, getSevenDays } = require('../controllers/transaction');
const router = express.Router();

router.post('/verify',handleAccountVerification);
router.post('/pay',handlePayment);
router.post('/get-by-page',getTransactionsByPage);
router.post('/getlatest',getLatest);
router.post('/getsevendays',getSevenDays);

module.exports = router;