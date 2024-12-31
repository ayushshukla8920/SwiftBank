const express = require('express');
const router = express.Router();
const { handleAdminLogout,handleClientLogout } = require('../controllers/logout');

router.get('/',handleClientLogout);
router.get('/admin',handleAdminLogout);

module.exports = router;