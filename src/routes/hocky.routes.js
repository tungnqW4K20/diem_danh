'use strict';
const express = require('express');
const router = express.Router();
const hocKyController = require('../controllers/hocky.controller');

router.get('/all', hocKyController.getAllHocKy);

module.exports = router;
