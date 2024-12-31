const express = require('express');
const router = express.Router();
const {handleUserOnboarding, handleGetUserDetails} = require('../controller/user');


router.post('/',handleUserOnboarding);

router.get('/:email',handleGetUserDetails);


module.exports = router;