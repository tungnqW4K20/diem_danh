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


const handleGetGiangVienByMaKhoa = async (req, res) => {
    try {
        // Lấy ma_khoa từ query string (?ma_khoa=CNTT)
        let maKhoa = req.query.ma_khoa;

        if (!maKhoa) {
            return res.status(400).json({
                errCode: 1,
                message: 'Missing required parameter: ma_khoa'
            });
        }

        let response = await giangVienService.getGiangVienByMaKhoa(maKhoa);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};



const getAllGiangVien = async (req, res) => {
    try {
        const response = await giangVienService.getAllGiangVienService();
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}


const handleCreateGiangVien = async (req, res) => {
    try {
        const { ma_gv, ho, ten } = req.body;
        if (!ma_gv || !ho || !ten) {
            return res.status(400).json({ errCode: 1, message: 'Vui lòng nhập đủ: Mã GV, Họ, Tên' });
        }
        const message = await giangVienService.createGiangVien(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Error from server' });
    }
};

const handleGetGiangVienById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ errCode: 1, message: 'Missing ID' });
        
        const response = await giangVienService.getGiangVienById(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Error from server' });
    }
};

const handleUpdateGiangVien = async (req, res) => {
    try {
        const data = req.body;
        // Nếu client gửi id qua URL params thì gán vào body
        if(req.params.id) data.giangvien_id = req.params.id;

        const message = await giangVienService.updateGiangVien(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Error from server' });
    }
};

const handleDeleteGiangVien = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL params
        if (!id) return res.status(400).json({ errCode: 1, message: 'Missing ID' });

        const message = await giangVienService.deleteGiangVien(id);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Error from server' });
    }
};


module.exports = {
    getPhanCongTheoHocKy,
    getLichGiangDay,
    handleGetGiangVienByMaKhoa,
    getAllGiangVien,
    handleCreateGiangVien,
    handleGetGiangVienById,
    handleUpdateGiangVien,
    handleDeleteGiangVien
};