const express = require('express');
const router = express.Router();
const { handleHomePage } = require('../controllers/home');

router.post('/user',handleHomePage);

module.exports = router;