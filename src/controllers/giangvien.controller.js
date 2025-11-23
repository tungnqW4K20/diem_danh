'use strict';

const giangVienService = require('../services/giangvien.service');

const getPhanCongTheoHocKy = async (req, res) => {
    try {
        const { giangvien_id } = req.params;
        if (!giangvien_id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID giảng viên trong đường dẫn.' });
        }

        const { hocky_id } = req.query;
        if (!hocky_id) {
            return res.status(400).json({ success: false, message: 'Thiếu tham số bắt buộc: hocky_id' });
        }

        const data = await giangVienService.getPhanCongTheoHocKy(giangvien_id, hocky_id);

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách phân công thành công.',
            data: data
        });
    } catch (error) {
        console.error("Get Phan Cong Error:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy danh sách phân công.' });
    }
};

const getLichGiangDay = async (req, res) => {
    try {
        // Lấy giangvien_id từ URL param thay vì req.user
        const { giangvien_id } = req.params;
        if (!giangvien_id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID giảng viên trong đường dẫn.' });
        }

        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Thiếu tham số bắt buộc: startDate và endDate' });
        }

        if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ success: false, message: 'Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD.' });
        }

        const data = await giangVienService.getLichGiangDay(giangvien_id, new Date(startDate), new Date(endDate));

        res.status(200).json({
            success: true,
            message: 'Lấy lịch giảng dạy thành công.',
            data: data
        });

    } catch (error) {
        console.error("Get Lich Giang Day Error:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy lịch giảng dạy.' });
    }
};

module.exports = {
    getPhanCongTheoHocKy,
    getLichGiangDay
};