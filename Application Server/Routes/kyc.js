const express = require('express');
const router = express.Router();
const { handleKYCSubmit } = require('../controllers/kyc')

router.post('/submit',handleKYCSubmit)

module.exports = router;