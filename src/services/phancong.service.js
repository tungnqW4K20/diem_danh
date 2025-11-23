'use strict';
const db = require('../models');


const getLichGiangDay = async (giangvien_id, hocky_id) => {
  try {
    const lichGiangDay = await db.PhanCongMon.findAll({
      where: {
        giangvien_id,
        hocky_id
      },
      attributes: ['phancong_id', 'thu', 'gio_batdau', 'gio_ketthuc', 'phong'],
      
      include: [
        {
          model: db.MonHoc,
          attributes: ['ten_mon', 'ma_mon'] 
        },
        {
          model: db.Lop,
          attributes: ['ten_lop'] 
        }
      ],
      
      order: [
        db.sequelize.fn('FIELD', db.sequelize.col('thu'), 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
        ['gio_batdau', 'ASC']
      ]
    });

    return lichGiangDay;
  } catch (error) {
    console.error("Lỗi khi lấy lịch giảng dạy:", error);
    throw new Error(`Lỗi khi lấy lịch giảng dạy: ${error.message}`);
  }
};

module.exports = {
  getLichGiangDay
};