'use strict';
const db = require('../models');



const getLichGiangDay = async (giangvien_id, hocky_id) => {
  try {
    const lichGiangDay = await db.LopHocPhan.findAll({
      where: {
        giangvien_id,
        hocky_id
      },

      attributes: ['lophocphan_id', 'thu', 'gio_batdau', 'gio_ketthuc', 'phong'],

      include: [
        {
          model: db.MonHoc,
          attributes: ['ten_mon', 'ma_mon']
        },
        {
          model: db.HocKy,
          attributes: ['ten_hocky']
        },
        {
          model: db.LopHanhChinh,
          attributes: ['ten_lop'],
          as: 'LopHanhChinh'
        },
        // ⭐ THÊM BUỔI HỌC VÀO ĐÂY
        {
          model: db.BuoiHoc,
          as: 'DanhSachBuoiHoc',
          attributes: ['buoi_id', 'ngay', 'batdau', 'ketthuc', 'trangthai'],
          required: false, // lấy cả lớp chưa có buổi học
          separate: true,
          order: [['ngay', 'ASC']]
        }
      ],

      order: [
        db.sequelize.fn(
          'FIELD', db.sequelize.col('thu'),
          'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        ),
        ['gio_batdau', 'ASC']
      ]
    });

    return lichGiangDay;

  } catch (error) {
    console.error("Lỗi khi lấy lịch giảng dạy:", error);
    throw new Error(`Lỗi khi lấy lịch giảng dạy: ${error.message}`);
  }
};


const getLichTheoNgay = async (giangvien_id, today, tomorrow) => {
  const data = await db.LopHocPhan.findAll({
    where: { giangvien_id },
    include: [
      { model: db.MonHoc, attributes: ["ten_mon"] },
      { model: db.HocKy, attributes: ["ten_hocky"] },
      {
        model: db.BuoiHoc,
        as: "DanhSachBuoiHoc",
        where: { ngay: [today, tomorrow] },
        required: false
      }
    ],
    order: [["gio_batdau", "ASC"]]
  });
  return data
};

const getLichTuanNay = async (giangvien_id, startDate, endDate) => {
  const data = await db.LopHocPhan.findAll({
    where: { giangvien_id },
    include: [
      { model: db.MonHoc, attributes: ["ten_mon"] },
      { model: db.HocKy, attributes: ["ten_hocky"] },
      { model: db.LopHanhChinh, attributes: ["ten_lop"], as: 'LopHanhChinh' },
      {
        model: db.BuoiHoc,
        as: "DanhSachBuoiHoc",
        where: {
          ngay: {
            [db.Sequelize.Op.between]: [startDate, endDate]
          }
        },
        required: false
      }
    ],
    order: [["gio_batdau", "ASC"]]
  });
  return data
};





module.exports = {
  getLichGiangDay,
  getLichTheoNgay,
  getLichTuanNay
};