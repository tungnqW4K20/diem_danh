'use strict';
const hocKyService = require('../services/hocky.service');

const getAllHocKy = async (req, res) => {
  try {
    const data = await hocKyService.getAllHocKy();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách học kỳ thành công.",
      data
    });

  } catch (error) {
    console.error("Lỗi API getAllHocKy:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllHocKy
};
