'use strict';
const phanCongService = require('../services/phancong.service');

const getLichGiangDay = async (req, res) => {
  try {
    const { giangvien_id, hocky_id } = req.query;

    if (!giangvien_id || !hocky_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ giangvien_id và hocky_id."
      });
    }

    const data = await phanCongService.getLichGiangDay(giangvien_id, hocky_id);

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không tìm thấy lịch giảng dạy cho giảng viên trong học kỳ này.",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy lịch giảng dạy thành công.",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getLichGiangDay
};