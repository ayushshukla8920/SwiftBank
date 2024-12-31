const express = require('express');
const router = express.Router();
const { handleUserBalance } = require('../controller/balance');


router.get('/:customerId',handleUserBalance);

module.exports = router;