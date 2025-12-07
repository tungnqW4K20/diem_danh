const express = require('express');
const router = express.Router();
const khoaController = require('../controllers/khoa.controller');

router.get('/get-all-khoa', khoaController.handleGetAllKhoa);

router.get('/get-detail-khoa', khoaController.handleGetKhoaById);

router.post('/create-khoa', khoaController.handleCreateKhoa);

router.put('/update-khoa', khoaController.handleUpdateKhoa);

router.delete('/delete-khoa', khoaController.handleDeleteKhoa);

module.exports = router;