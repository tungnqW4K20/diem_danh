'use strict';
const db = require('../models');

const lopService = require('../services/lop.service');

const getAll = async (req, res, next) => {
    try {
        const data = await lopService.getAllLop();

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách lớp học thành công.',
            data: data
        });
    } catch (error) {
        console.error("Get All Lop Error:", error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ khi lấy danh sách lớp học.'
        });
    }
};

const getStudentsByClass = async (req, res, next) => {
    try {
        const { lop_id } = req.params;
        if (!lop_id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID của lớp trong đường dẫn.' });
        }

        const lop = await db.Lop.findByPk(lop_id);
        if (!lop) {
            return res.status(404).json({ success: false, message: `Không tìm thấy lớp học với ID ${lop_id}.` });
        }

        const data = await lopService.getStudentsByClassId(lop_id);
        
        
        res.status(200).json({
            success: true,
            message: `Lấy danh sách sinh viên của lớp '${lop.ten_lop}' thành công.`,
            data: data
        });
    } catch (error) {
        console.error("Get Students By Class ID Error:", error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ khi lấy danh sách sinh viên.'
        });
    }
};



module.exports = {
    getAll,
    getStudentsByClass
};