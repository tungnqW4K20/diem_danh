'use strict';
const db = require('../models');

const getAllHocKy = async () => {
  try {
    const result = await db.HocKy.findAll({
      attributes: ['hocky_id', 'ten_hocky', 'ngay_batdau', 'ngay_ketthuc'],
      order: [['ngay_batdau', 'ASC']]
    });

    return result;

  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách học kỳ: " + error.message);
  }
};

module.exports = {
  getAllHocKy
};
