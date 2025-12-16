'use strict';
const db = require('../models');
const { Op } = require('sequelize'); // Cần import Op để dùng cho truy vấn ngày tháng

const getLichGiangDay = async (giangvien_id, hocky_id) => {
  try {
    const lichGiangDay = await db.LopHocPhan.findAll({
      where: {
        giangvien_id,
        hocky_id
      },
      // ✅ THÊM ten_lophocphan VÀO ĐÂY
      attributes: [
        'lophocphan_id', 
        'ten_lophocphan', 
        'thu', 
        'gio_batdau', 
        'gio_ketthuc', 
        'phong'
      ],

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
          as: 'DanhSachLopHanhChinh', // ✅ SỬA ALIAS: Phải khớp với Model (hasMany/belongsToMany)
          through: { attributes: [] } // Bỏ qua bảng trung gian
        },
        {
          model: db.BuoiHoc,
          as: 'DanhSachBuoiHoc',
          attributes: ['buoi_id', 'ngay', 'batdau', 'ketthuc', 'trangthai'],
          required: false, // Lấy cả lớp chưa có buổi (để xem lịch tổng quát)
          separate: true,  // Tách query giúp tối ưu tốc độ khi load nhiều buổi
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
  try {
    const data = await db.LopHocPhan.findAll({
      where: { giangvien_id },
      // ✅ THÊM ten_lophocphan
      attributes: [
        'lophocphan_id', 
        'ten_lophocphan', 
        'phong', 
        'gio_batdau', 
        'gio_ketthuc',
        'thu'
      ],
      include: [
        { 
          model: db.MonHoc, 
          attributes: ["ten_mon", "ma_mon"] 
        },
        { 
          model: db.HocKy, 
          attributes: ["ten_hocky"] 
        },
        { 
          model: db.LopHanhChinh, 
          attributes: ["ten_lop"], 
          as: 'DanhSachLopHanhChinh', // ✅ SỬA ALIAS
          through: { attributes: [] }
        },
        {
          model: db.BuoiHoc,
          as: "DanhSachBuoiHoc",
          where: { 
            ngay: { [Op.in]: [today, tomorrow] } // ✅ Dùng Op.in để an toàn hơn
          },
          attributes: ['buoi_id', 'ngay', 'batdau', 'ketthuc', 'trangthai'],
          required: true // ✅ QUAN TRỌNG: Chỉ lấy những lớp CÓ dạy vào ngày hôm đó
        }
      ],
      order: [["gio_batdau", "ASC"]]
    });
    return data;
  } catch (error) {
    console.error("Lỗi getLichTheoNgay:", error);
    throw error;
  }
};

const getLichTuanNay = async (giangvien_id, startDate, endDate) => {
  try {
    const data = await db.LopHocPhan.findAll({
      where: { giangvien_id },
      // ✅ THÊM ten_lophocphan
      attributes: [
        'lophocphan_id', 
        'ten_lophocphan', 
        'phong', 
        'gio_batdau', 
        'gio_ketthuc',
        'thu'
      ],
      include: [
        { 
          model: db.MonHoc, 
          attributes: ["ten_mon", "ma_mon"] 
        },
        { 
          model: db.HocKy, 
          attributes: ["ten_hocky"] 
        },
        { 
          model: db.LopHanhChinh, 
          attributes: ["ten_lop"], 
          as: 'DanhSachLopHanhChinh', // ✅ SỬA ALIAS
          through: { attributes: [] }
        },
        {
          model: db.BuoiHoc,
          as: "DanhSachBuoiHoc",
          where: {
            ngay: {
              [Op.between]: [startDate, endDate] // ✅ Dùng Op.between
            }
          },
          attributes: ['buoi_id', 'ngay', 'batdau', 'ketthuc', 'trangthai'],
          required: true // ✅ Chỉ lấy lớp có lịch trong tuần
        }
      ],
      order: [
        ['ngay_tao', 'ASC'], // Hoặc order theo ngày của buổi học nếu cần xử lý thêm
        ["gio_batdau", "ASC"]
      ]
    });
    return data;
  } catch (error) {
    console.error("Lỗi getLichTuanNay:", error);
    throw error;
  }
};

module.exports = {
  getLichGiangDay,
  getLichTheoNgay,
  getLichTuanNay
};



