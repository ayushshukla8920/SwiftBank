const express = require('express');
const router = express.Router();
const { handleDepositValidation, handleGenerateOrderID } = require('../controllers/deposit');

router.post('/generate-orderid',handleGenerateOrderID);

router.post('/validate',handleDepositValidation);

module.exports = router;