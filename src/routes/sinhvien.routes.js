'use strict';
const express = require('express');
const router = express.Router();
const svController = require('../controllers/sinhvien.controller');
const upload = require('../middlewares/upload.middleware'); 

router.get('/lop/:lop_hanhchinh_id', svController.getSinhVienByLop);

router.post('/', svController.createSinhVien);

router.put('/:sinhvien_id', svController.updateSinhVien);

router.delete('/:sinhvien_id', svController.deleteSinhVien);
router.post('/import', upload.single('file'), svController.importStudents);

module.exports = router;
