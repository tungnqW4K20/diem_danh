'use strict';
const svService = require('../services/sinhvien.service');

const getSinhVienByLop = async (req, res) => {
    try {
        const { lop_hanhchinh_id } = req.params;

        const list = await svService.getSinhVienByLop(lop_hanhchinh_id);

        return res.json({
            success: true,
            message: 'Lấy danh sách sinh viên thành công',
            data: list
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createSinhVien = async (req, res) => {
    try {
        const data = req.body;

        const sv = await svService.createSinhVien(data);

        return res.status(201).json({
            success: true,
            message: 'Thêm sinh viên thành công',
            data: sv
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

const updateSinhVien = async (req, res) => {
    try {
        const { sinhvien_id } = req.params;
        const data = req.body;

        const sv = await svService.updateSinhVien(sinhvien_id, data);

        return res.json({
            success: true,
            message: 'Cập nhật sinh viên thành công',
            data: sv
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

const deleteSinhVien = async (req, res) => {
    try {
        const { sinhvien_id } = req.params;

        await svService.softDeleteSinhVien(sinhvien_id);

        return res.json({
            success: true,
            message: 'Xóa mềm sinh viên thành công'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getSinhVienByLop,
    createSinhVien,
    updateSinhVien,
    deleteSinhVien
};
