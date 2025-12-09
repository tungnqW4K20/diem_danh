const express = require('express');
const router = express.Router();
const monHocController = require('../controllers/monhoc.controller');

// GET: Lấy danh sách (có thể ?search=...)
router.get('/', monHocController.handleGetAll);

// GET: Lấy chi tiết 1 môn
router.get('/:id', monHocController.handleGetById);

// POST: Tạo mới môn học
router.post('/', monHocController.handleCreate);

// PUT: Cập nhật môn học
router.put('/:id', monHocController.handleUpdate);

// DELETE: Xóa môn học (Soft delete)
router.delete('/:id', monHocController.handleDelete);

module.exports = router;