'use strict';

const express = require('express');
const giangVienController = require('../controllers/giangvien.controller');

const router = express.Router();



router.get('/:giangvien_id/phan-cong', giangVienController.getPhanCongTheoHocKy);
router.get('/', giangVienController.getAllGiangVien);

router.get('/:giangvien_id/lich-giang-day', giangVienController.getLichGiangDay);
router.get('/get-gv-by-khoa', giangVienController.handleGetGiangVienByMaKhoa);

// 1. Lấy danh sách tất cả giảng viên
// router.get('/', giangVienController.getAllGiangVien);

// 2. Lấy chi tiết 1 giảng viên theo ID
router.get('/:id', giangVienController.handleGetGiangVienById);

// 3. Tạo mới giảng viên
router.post('/', giangVienController.handleCreateGiangVien);

// 4. Cập nhật giảng viên
router.put('/:id', giangVienController.handleUpdateGiangVien);

// 5. Xóa giảng viên (Soft delete)
router.delete('/:id', giangVienController.handleDeleteGiangVien);

module.exports = router;