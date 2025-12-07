'use strict';
const express = require('express');
const router = express.Router();
const svController = require('../controllers/sinhvien.controller');

router.get('/lop/:lop_hanhchinh_id', svController.getSinhVienByLop);

router.post('/', svController.createSinhVien);

router.put('/:sinhvien_id', svController.updateSinhVien);

router.delete('/:sinhvien_id', svController.deleteSinhVien);

module.exports = router;
