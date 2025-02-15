const express = require('express');
const router = express.Router();
const { handleAdminLogout,handleClientLogout } = require('../controllers/logout');

router.post('/',handleClientLogout);
router.post('/admin',handleAdminLogout);

module.exports = router;