'use strict';
const db = require('../models');

const getPhanCongTheoHocKy = async (giangvien_id, hocky_id) => {
  try {
    const monHocs = await db.MonHoc.findAll({
      attributes: ['monhoc_id', 'ten_mon', 'ma_mon', 'sotinchi'],

      include: [{
        model: db.PhanCongMon,
        attributes: [], 
        where: {
          giangvien_id,
          hocky_id
        },
        required: true 
      }],

      order: [['ten_mon', 'ASC']]
    });

    return monHocs;
  } catch (error) {
    console.error('Lỗi khi truy vấn môn học được phân công:', error);
    throw new Error(`Lỗi truy vấn môn học được phân công: ${error.message}`);
  }
};

module.exports = {
  getPhanCongTheoHocKy, 
};