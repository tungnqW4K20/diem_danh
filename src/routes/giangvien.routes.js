'use strict';

const express = require('express');
const giangVienController = require('../controllers/giangvien.controller');

const router = express.Router();


router.get('/:giangvien_id/phan-cong', giangVienController.getPhanCongTheoHocKy);

router.get('/:giangvien_id/lich-giang-day', giangVienController.getLichGiangDay);

module.exports = router;