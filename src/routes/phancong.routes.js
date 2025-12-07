'use strict';
const express = require('express');
const router = express.Router();
const phanCongController = require('../controllers/phancong.controller');

// Định nghĩa endpoint GET để lấy lịch giảng dạy
// URL: GET http://your-domain/api/phancong/lich-giang-day
router.get('/lich-giang-day', phanCongController.getLichGiangDay);
router.get('/lich-giang-day/homnay', phanCongController.getLichHomNay);

module.exports = router;