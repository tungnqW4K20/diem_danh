'use strict';
const db = require('../models');
const dayjs = require('dayjs');
let uuidv4;
(async () => {
  const uuid = await import('uuid');
  uuidv4 = uuid.v4;
})();/**
 * Tạo phân công và tự động sinh buổi học
 * POST /api/phan-cong-auto/create
 * Body: {
 *   giangvien_id, hocky_id, monhoc_id, lop_hanhchinh_id,
 *   thu, gio_batdau, gio_ketthuc, phong,
 *   ngay_batdau, so_tiet (số buổi học)
 * }
 */
// const taoLopHocPhanVaBuoiHoc = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
  
//   try {
//     const {
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,              // Mon, Tue, Wed, Thu, Fri, Sat, Sun
//       gio_batdau,       // VD: "07:00:00"
//       gio_ketthuc,      // VD: "09:30:00"
//       phong,
//       ngay_batdau,      // YYYY-MM-DD
//       so_tiet           // Số buổi học (VD: 80)
//     } = req.body;

//     // Validate
//     if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_id || !thu || !ngay_batdau || !so_tiet) {
//       return res.status(400).json({
//         success: false,
//         message: 'Thiếu thông tin bắt buộc'
//       });
//     }
//     // Lấy taikhoan_id từ giangvien_id
//     const giangVien = await db.GiangVien.findByPk(giangvien_id, {
//       include: [{
//         model: db.TaiKhoan,
//         as: 'TaiKhoan',
//         attributes: ['taikhoan_id']
//       }]
//     });

//     if (!giangVien || !giangVien.TaiKhoan) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy tài khoản giảng viên'
//       });
//     }

//     const taikhoan_id = giangVien.TaiKhoan.taikhoan_id;
//     // 1. Tạo LopHocPhan
//     const lopHocPhan = await db.LopHocPhan.create({
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_tao: new Date()
//     }, { transaction });

//     // 2. Tạo tất cả BuoiHoc
//     const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
//     const targetDay = daysOfWeek[thu];
    
//     if (targetDay === undefined) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Thứ không hợp lệ. Sử dụng: Mon, Tue, Wed, Thu, Fri, Sat, Sun'
//       });
//     }

//     const buoiHocList = [];
//     let currentDate = dayjs(ngay_batdau);

//     // Tìm ngày đầu tiên khớp với thứ
//     while (currentDate.day() !== targetDay) {
//       currentDate = currentDate.add(1, 'day');
//     }

//     // Tạo các buổi học
//     for (let i = 0; i < so_tiet; i++) {
//       const ngay = currentDate.format('YYYY-MM-DD');
//       const batdau = `${ngay} ${gio_batdau}`;
//       const ketthuc = `${ngay} ${gio_ketthuc}`;

//       buoiHocList.push({
//         lophocphan_id: lopHocPhan.lophocphan_id,
//         ngay,
//         batdau,
//         ketthuc,
//         trangthai: 'scheduled',
//         nguoi_tao: taikhoan_id,
//         ngay_tao: new Date(),
//       });

//       // Sang tuần sau (cùng thứ)
//       currentDate = currentDate.add(7, 'day');
//     }

//     // Bulk insert
//     await db.BuoiHoc.bulkCreate(buoiHocList, { transaction });

//     await transaction.commit();

//     res.status(201).json({
//       success: true,
//       message: `Đã tạo lớp học phần và ${so_tiet} buổi học thành công`,
//       data: {
//         lophocphan_id: lopHocPhan.lophocphan_id,
//         so_buoi_hoc_tao: so_tiet
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error('Lỗi tạo phân công:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

/**
 * Cập nhật một buổi học cụ thể
 * PUT /api/phan-cong-auto/buoi-hoc/:buoi_id
 */
const capNhatBuoiHoc = async (req, res) => {
  try {
    const { buoi_id } = req.params;
    const { ngay, batdau, ketthuc, trangthai, ghichu } = req.body;

    const buoiHoc = await db.BuoiHoc.findByPk(buoi_id);
    
    if (!buoiHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy buổi học'
      });
    }

    // Update
    if (ngay) buoiHoc.ngay = ngay;
    if (batdau) buoiHoc.batdau = batdau;
    if (ketthuc) buoiHoc.ketthuc = ketthuc;
    if (trangthai) buoiHoc.trangthai = trangthai;
    if (ghichu !== undefined) buoiHoc.ghichu = ghichu;

    await buoiHoc.save();

    res.json({
      success: true,
      message: 'Cập nhật buổi học thành công',
      data: buoiHoc
    });

  } catch (error) {
    console.error('Lỗi cập nhật buổi học:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Hủy một buổi học (soft delete hoặc đổi trạng thái)
 * DELETE /api/phan-cong-auto/buoi-hoc/:buoi_id
 */
const huyBuoiHoc = async (req, res) => {
  try {
    const { buoi_id } = req.params;
    const { ly_do } = req.body;

    const buoiHoc = await db.BuoiHoc.findByPk(buoi_id);
    
    if (!buoiHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy buổi học'
      });
    }

    // Đổi trạng thái thành cancelled
    buoiHoc.trangthai = 'cancelled';
    buoiHoc.ghichu = ly_do || 'Buổi học bị hủy';
    await buoiHoc.save();

    res.json({
      success: true,
      message: 'Đã hủy buổi học',
      data: buoiHoc
    });

  } catch (error) {
    console.error('Lỗi hủy buổi học:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Xóa hoàn toàn một buổi học
 * DELETE /api/phan-cong-auto/buoi-hoc/:buoi_id/force
 */
const xoaBuoiHoc = async (req, res) => {
  try {
    const { buoi_id } = req.params;

    const buoiHoc = await db.BuoiHoc.findByPk(buoi_id);
    
    if (!buoiHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy buổi học'
      });
    }

    // Xóa các điểm danh liên quan trước
    await db.DiemDanh.destroy({ where: { buoi_id } });

    // Xóa buổi học
    await buoiHoc.destroy();

    res.json({
      success: true,
      message: 'Đã xóa buổi học và điểm danh liên quan'
    });

  } catch (error) {
    console.error('Lỗi xóa buổi học:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Lấy danh sách buổi học của một lớp học phần
 * GET /api/phan-cong-auto/:lophocphan_id/buoi-hoc
 */
const layDanhSachBuoiHoc = async (req, res) => {
  try {
    const { lophocphan_id } = req.params;
    const { trangthai } = req.query; // Filter theo trạng thái

    const where = { lophocphan_id };
    if (trangthai) where.trangthai = trangthai;

    const buoiHocList = await db.BuoiHoc.findAll({
      where,
      order: [['batdau', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Lấy danh sách buổi học thành công',
      data: buoiHocList
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách buổi học:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cập nhật hàng loạt buổi học (VD: dời tất cả buổi học sang phòng khác)
 * PUT /api/phan-cong-auto/:lophocphan_id/buoi-hoc/bulk
 */
const capNhatHangLoatBuoiHoc = async (req, res) => {
  try {
    const { lophocphan_id } = req.params;
    const { buoi_ids, updates } = req.body; // buoi_ids: [], updates: { phong, trangthai, ... }

    if (!buoi_ids || !Array.isArray(buoi_ids) || buoi_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp danh sách buoi_ids'
      });
    }

    const result = await db.BuoiHoc.update(
      updates,
      {
        where: {
          buoi_id: buoi_ids,
          lophocphan_id
        }
      }
    );

    res.json({
      success: true,
      message: `Đã cập nhật ${result[0]} buổi học`,
      data: { so_buoi_cap_nhat: result[0] }
    });

  } catch (error) {
    console.error('Lỗi cập nhật hàng loạt:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// const taoLopHocPhanVaBuoiHoc = async (req, res) => {
//   const transaction = await db.sequelize.transaction();

//   try {
//     const {
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_batdau,
//       so_tiet
//     } = req.body;

//     if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_id || !thu || !ngay_batdau || !so_tiet) {
//       return res.status(400).json({
//         success: false,
//         message: 'Thiếu thông tin bắt buộc'
//       });
//     }

//     // Lấy tài khoản giảng viên
//     const giangVien = await db.GiangVien.findByPk(giangvien_id, {
//       include: [{
//         model: db.TaiKhoan,
//         as: 'TaiKhoan',
//         attributes: ['taikhoan_id']
//       }]
//     });

//     if (!giangVien || !giangVien.TaiKhoan) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy tài khoản giảng viên'
//       });
//     }

//     const taikhoan_id = giangVien.TaiKhoan.taikhoan_id;

//     // === 🔥 LẤY THÔNG TIN MÃ MÔN + MÃ LỚP HÀNH CHÍNH ===
//     const monHoc = await db.MonHoc.findByPk(monhoc_id, {
//       attributes: ['ma_mon']
//     });

//     const lopHanhChinh = await db.LopHanhChinh.findByPk(lop_hanhchinh_id, {
//       attributes: ['lop_hanhchinh_id']
//     });

//     if (!monHoc || !lopHanhChinh) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy môn học hoặc lớp hành chính'
//       });
//     }

//     // === 🔥 TẠO MÃ LỚP HỌC PHẦN:   CTDLGT1_12522W2 ===
//     const lophocphan_id = `${monHoc.ma_mon}_${lopHanhChinh.lop_hanhchinh_id}`;

//     // 1. Tạo LopHocPhan
//     const lopHocPhan = await db.LopHocPhan.create({
//       lophocphan_id,             // <-- Gán mã mới tự tạo
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_tao: new Date()
//     }, { transaction });

//     // 2. Tạo BuoiHoc
//     const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
//     const targetDay = daysOfWeek[thu];

//     if (targetDay === undefined) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Thứ không hợp lệ. Dùng: Mon, Tue, Wed, Thu, Fri, Sat, Sun'
//       });
//     }

//     const buoiHocList = [];
//     let currentDate = dayjs(ngay_batdau);

//     while (currentDate.day() !== targetDay) {
//       currentDate = currentDate.add(1, 'day');
//     }

//     for (let i = 0; i < so_tiet; i++) {
//       const ngay = currentDate.format('YYYY-MM-DD');

//       buoiHocList.push({
//         lophocphan_id: lophocphan_id,   // <-- dùng mã mới
//         ngay,
//         batdau: `${ngay} ${gio_batdau}`,
//         ketthuc: `${ngay} ${gio_ketthuc}`,
//         trangthai: 'scheduled',
//         nguoi_tao: taikhoan_id,
//         ngay_tao: new Date(),
//       });

//       currentDate = currentDate.add(7, 'day');
//     }

//     await db.BuoiHoc.bulkCreate(buoiHocList, { transaction });

//     await transaction.commit();

//     res.status(201).json({
//       success: true,
//       message: `Đã tạo lớp học phần ${lophocphan_id} và ${so_tiet} buổi học`,
//       data: {
//         lophocphan_id,
//         so_buoi_hoc_tao: so_tiet
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error('Lỗi tạo phân công:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// const taoLopHocPhanVaBuoiHoc = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
  
//   try {
//     const {
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_batdau,
//       so_tiet
//     } = req.body;

//     // Validate
//     if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_id || !thu || !ngay_batdau || !so_tiet) {
//       return res.status(400).json({
//         success: false,
//         message: 'Thiếu thông tin bắt buộc'
//       });
//     }

//     // Lấy tài khoản của giảng viên
//     const giangVien = await db.GiangVien.findByPk(giangvien_id, {
//       include: [{
//         model: db.TaiKhoan,
//         as: 'TaiKhoan',
//         attributes: ['taikhoan_id']
//       }]
//     });

//     if (!giangVien || !giangVien.TaiKhoan) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy tài khoản giảng viên'
//       });
//     }

//     const taikhoan_id = giangVien.TaiKhoan.taikhoan_id;

//     // Lấy ma_mon
//     const monHoc = await db.MonHoc.findByPk(monhoc_id);
//     if (!monHoc) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy môn học" });
//     }

//     // Lấy ten_lop
//     const lopHanhChinh = await db.LopHanhChinh.findByPk(lop_hanhchinh_id);
//     if (!lopHanhChinh) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy lớp hành chính" });
//     }

//     // ===== GHÉP MÃ LỚP HỌC PHẦN =====
//     const lophocphan_id = `${monHoc.ma_mon}_${lopHanhChinh.ten_lop}`;

//     // Kiểm tra trùng mã
//     const checkExist = await db.LopHocPhan.findByPk(lophocphan_id);
//     if (checkExist) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: "Mã lớp học phần đã tồn tại"
//       });
//     }

//     // ===== 1. Tạo lớp học phần =====
//     const lopHocPhan = await db.LopHocPhan.create({
//       lophocphan_id,      // <-- GÁN ID GHÉP TỰ TẠO
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_tao: new Date()
//     }, { transaction });

//     // ===== 2. Tạo buổi học =====
//     const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
//     const targetDay = daysOfWeek[thu];

//     if (targetDay === undefined) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Thứ không hợp lệ. Sử dụng: Mon, Tue, Wed, Thu, Fri, Sat, Sun'
//       });
//     }

//     const buoiHocList = [];
//     let currentDate = dayjs(ngay_batdau);

//     // Tìm ngày đầu tiên trùng thứ
//     while (currentDate.day() !== targetDay) {
//       currentDate = currentDate.add(1, 'day');
//     }

//     // Tạo danh sách các buổi
//     for (let i = 0; i < so_tiet; i++) {
//       const ngay = currentDate.format("YYYY-MM-DD");

//       buoiHocList.push({
//         lophocphan_id: lophocphan_id,   // <-- dùng mã ghép làm khóa ngoại
//         ngay,
//         batdau: `${ngay} ${gio_batdau}`,
//         ketthuc: `${ngay} ${gio_ketthuc}`,
//         trangthai: 'scheduled',
//         nguoi_tao: taikhoan_id,
//         ngay_tao: new Date(),
//       });

//       currentDate = currentDate.add(7, "day");
//     }

//     await db.BuoiHoc.bulkCreate(buoiHocList, { transaction });

//     await transaction.commit();

//     return res.status(201).json({
//       success: true,
//       message: `Đã tạo lớp học phần và ${so_tiet} buổi học thành công`,
//       data: {
//         lophocphan_id,
//         so_buoi_hoc_tao: so_tiet
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error("Lỗi tạo lớp học phần:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// const taoLopHocPhanVaBuoiHoc = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
  
//   try {
//     const {
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_batdau,
//       so_tiet
//     } = req.body;

//     if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_id || !thu || !ngay_batdau || !so_tiet) {
//       return res.status(400).json({
//         success: false,
//         message: 'Thiếu thông tin bắt buộc'
//       });
//     }

//     // 1. Lấy tài khoản giảng viên
//     const giangVien = await db.GiangVien.findByPk(giangvien_id, {
//       include: [{
//         model: db.TaiKhoan,
//         as: 'TaiKhoan',
//         attributes: ['taikhoan_id']
//       }]
//     });

//     if (!giangVien || !giangVien.TaiKhoan) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy tài khoản giảng viên'
//       });
//     }

//     const taikhoan_id = giangVien.TaiKhoan.taikhoan_id;

//     // 2. Lấy môn học
//     const monHoc = await db.MonHoc.findByPk(monhoc_id);
//     if (!monHoc) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy môn học" });
//     }

//     // 3. Lấy lớp hành chính
//     const lopHanhChinh = await db.LopHanhChinh.findByPk(lop_hanhchinh_id);
//     if (!lopHanhChinh) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy lớp hành chính" });
//     }

//     // ===== GHÉP MÃ LỚP HỌC PHẦN =====
//     const lophocphan_id = `${monHoc.ma_mon}_${lopHanhChinh.ten_lop}`;

//     const checkExist = await db.LopHocPhan.findByPk(lophocphan_id);
//     if (checkExist) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: "Mã lớp học phần đã tồn tại"
//       });
//     }

//     // ===== 1. Tạo lớp học phần =====
//     const lopHocPhan = await db.LopHocPhan.create({
//       lophocphan_id,
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_tao: new Date()
//     }, { transaction });

//     // ===== 2. Tạo buổi học =====
//     const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
//     const targetDay = daysOfWeek[thu];

//     if (targetDay === undefined) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Thứ không hợp lệ. Sử dụng: Mon, Tue, Wed, Thu, Fri, Sat, Sun'
//       });
//     }

//     const buoiHocList = [];
//     let currentDate = dayjs(ngay_batdau);

//     while (currentDate.day() !== targetDay) {
//       currentDate = currentDate.add(1, 'day');
//     }

//     for (let i = 0; i < so_tiet; i++) {
//       const ngay = currentDate.format("YYYY-MM-DD");

//       buoiHocList.push({
//         lophocphan_id: lophocphan_id,
//         ngay,
//         batdau: `${ngay} ${gio_batdau}`,
//         ketthuc: `${ngay} ${gio_ketthuc}`,
//         trangthai: 'scheduled',
//         nguoi_tao: taikhoan_id,
//         ngay_tao: new Date(),
//       });

//       currentDate = currentDate.add(7, "day");
//     }

//     await db.BuoiHoc.bulkCreate(buoiHocList, { transaction });

//     // ===== 3. Auto đưa toàn bộ sinh viên vào lớp học phần =====
//     const danhSachSinhVien = await db.SinhVien.findAll({
//       where: { lop_hanhchinh_id },
//       attributes: ['sinhvien_id']
//     });

//     if (danhSachSinhVien.length > 0) {
//       const dkList = danhSachSinhVien.map(sv => ({
//         sinhvien_id: sv.sinhvien_id,
//         lophocphan_id: lophocphan_id,
//         ngay_dangky: new Date(),
//         trangthai: 'active'
//       }));

//       // UNIQUE INDEX tự xử lý duplicate
//       await db.DangKyHoc.bulkCreate(dkList, {
//         ignoreDuplicates: true,     // MySQL hỗ trợ
//         transaction
//       });
//     }

//     await transaction.commit();

//     return res.status(201).json({
//       success: true,
//       message: `Tạo lớp học phần + ${so_tiet} buổi học + auto thêm ${danhSachSinhVien.length} sinh viên thành công.`,
//       data: {
//         lophocphan_id,
//         so_buoi_hoc_tao: so_tiet,
//         so_sinhvien_them: danhSachSinhVien.length
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error("Lỗi tạo lớp học phần:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// API tạo lớp học phần hoàn chỉnh
// Yêu cầu: Sequelize, dayjs



/**
 * POST /lophocphan
 * Body:
 * {
 *   giangvien_id,
 *   hocky_id,
 *   monhoc_id,
 *   lop_hanhchinh_ids: [],    // nhiều lớp hành chính
 *   thu,
 *   gio_batdau,
 *   gio_ketthuc,
 *   phong,
 *   ngay_batdau,
 *   so_tuan
 * }
 */

const taoLopHocPhanVaBuoiHoc = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      giangvien_id,
      hocky_id,
      monhoc_id,
      lop_hanhchinh_ids,
      thu,
      gio_batdau,
      gio_ketthuc,
      phong,
      ngay_batdau,
      so_tuan,
    } = req.body;

    // ================= VALIDATION =================

    if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_ids || lop_hanhchinh_ids.length === 0 || !thu || !ngay_batdau || !so_tuan) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // 1. Lấy môn học
    const monHoc = await db.MonHoc.findByPk(monhoc_id);
    if (!monHoc) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Không tìm thấy môn học" });
    }

    // 2. Lấy danh sách lớp hành chính
    const dsLHC = await db.LopHanhChinh.findAll({
      where: { lop_hanhchinh_id: lop_hanhchinh_ids },
    });

    if (dsLHC.length !== lop_hanhchinh_ids.length) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Có lớp hành chính không tồn tại" });
    }

    // ================= SINH TEN LỚP HỌC PHẦN =================

    const ten_lop_ghep = dsLHC.map((l) => l.ten_lop).join("_");
    const ten_lophocphan = `${monHoc.ma_mon}_${ten_lop_ghep}`;

    // ================= TẠO LỚP HỌC PHẦN =================

    const lophocphan_id = uuidv4();

    const lop = await db.LopHocPhan.create(
      {
        lophocphan_id,
        monhoc_id,
        giangvien_id,
        hocky_id,
        ten_lophocphan,
        thu,
        gio_batdau,
        gio_ketthuc,
        phong,
      },
      { transaction }
    );

    // ================= GÁN LỚP HÀNH CHÍNH CHO LHP =================

    const lhp_lhc_records = lop_hanhchinh_ids.map((id) => ({
      lophocphan_id,
      lop_hanhchinh_id: id,
    }));

    await db.LHP_LHC.bulkCreate(lhp_lhc_records, { transaction });

    // ================= TỰ ĐỘNG THÊM SINH VIÊN =================

    // Lấy toàn bộ sinh viên thuộc các lớp hành chính
    const dsSinhVien = await db.SinhVien.findAll({
      where: { lop_hanhchinh_id: lop_hanhchinh_ids },
      attributes: ["sinhvien_id"],
    });

    const dkList = dsSinhVien.map((sv) => ({
      dkh_id: uuidv4(),
      sinhvien_id: sv.sinhvien_id,
      lophocphan_id,
    }));

    await db.DangKyHoc.bulkCreate(dkList, {
      ignoreDuplicates: true,
      transaction,
    });

    // ================= TẠO BUỔI HỌC =================

    const ngayBatDau = dayjs(ngay_batdau);
    const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    const targetDay = daysOfWeek[thu];

    if (targetDay === undefined) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Thứ không hợp lệ" });
    }

    let currentDate = ngayBatDau;
    while (currentDate.day() !== targetDay) {
      currentDate = currentDate.add(1, "day");
    }

    const buoiList = [];

    for (let i = 0; i < so_tuan; i++) {
      const ngayHoc = currentDate.format("YYYY-MM-DD");

      buoiList.push({
        buoi_id: uuidv4(),
        lophocphan_id,
        ngay: ngayHoc,
        gio_batdau,
        gio_ketthuc,
      });

      currentDate = currentDate.add(7, "day");
    }

    await db.BuoiHoc.bulkCreate(buoiList, { transaction });

    // ================= DONE =================

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: `Tạo LHP thành công: ${ten_lophocphan}`,
      data: {
        lophocphan_id,
        ten_lophocphan,
        so_lop_hanhchinh: lop_hanhchinh_ids.length,
        so_sinhvien: dsSinhVien.length,
        so_buoi_hoc: so_tuan,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};

// module.exports = { taoLopHocPhan };


// const taoLopHocLai = async (req, res) => {
//   const transaction = await db.sequelize.transaction();

//   try {
//     const {
//       giangvien_id,
//       hocky_id,
//       monhoc_id,
//       lop_hanhchinh_id,
//       thu,
//       gio_batdau,
//       gio_ketthuc,
//       phong,
//       ngay_batdau,
//       so_tuan,
//     } = req.body;

//     if (!giangvien_id || !hocky_id || !monhoc_id || !lop_hanhchinh_id || !thu || !ngay_batdau || !so_tuan) {
//       return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
//     }

//     // 1. Lấy môn học
//     const monHoc = await db.MonHoc.findByPk(monhoc_id);
//     if (!monHoc) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy môn học" });
//     }

//     // 2. Lấy lớp hành chính
//     const lopHC = await db.LopHanhChinh.findByPk(lop_hanhchinh_id);
//     if (!lopHC) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: "Không tìm thấy lớp hành chính" });
//     }

//     // 3. Sinh tên lớp học phần HL
//     const ten_lop_hc = lopHC.ten_lop.replace(/\s+/g, "");
//     const ten_lophocphan = `HL_${monHoc.ma_mon}_${ten_lop_hc}`;
//     const lophocphan_id = uuidv4();

//     // 4. Tạo lớp học lại
//     const lop = await db.LopHocPhan.create(
//       {
//         lophocphan_id,
//         monhoc_id,
//         giangvien_id,
//         hocky_id,
//         ten_lophocphan,
//         thu,
//         gio_batdau,
//         gio_ketthuc,
//         phong,
//       },
//       { transaction }
//     );

//     // 5. Tạo buổi học
//     const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
//     const targetDay = daysOfWeek[thu];

//     if (targetDay === undefined) {
//       await transaction.rollback();
//       return res.status(400).json({ success: false, message: "Thứ không hợp lệ" });
//     }

//     let currentDate = dayjs(ngay_batdau);
//     while (currentDate.day() !== targetDay) {
//       currentDate = currentDate.add(1, "day");
//     }

//     const buoiList = [];
//     for (let i = 0; i < so_tuan; i++) {
//       const ngayHoc = currentDate.format("YYYY-MM-DD");

//       buoiList.push({
//         buoi_id: uuidv4(),
//         lophocphan_id,
//         ngay: ngayHoc,
//         gio_batdau,
//         gio_ketthuc,
//       });

//       currentDate = currentDate.add(7, "day");
//     }

//     await db.BuoiHoc.bulkCreate(buoiList, { transaction });

//     await transaction.commit();

//     return res.status(201).json({
//       success: true,
//       message: `Tạo lớp học lại thành công: ${ten_lophocphan}`,
//       data: {
//         lophocphan_id,
//         ten_lophocphan,
//         so_buoi_hoc: so_tuan,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Lỗi tạo lớp học lại:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };



const taoLopHocLai = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      giangvien_id,
      hocky_id,
      monhoc_id,
      thu,
      gio_batdau,
      gio_ketthuc,
      phong,
      ngay_batdau,
      so_tuan
    } = req.body;

    if (!giangvien_id || !hocky_id || !monhoc_id || !thu || !ngay_batdau || !so_tuan) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // Lấy môn học
    const monHoc = await db.MonHoc.findByPk(monhoc_id);
    if (!monHoc) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Không tìm thấy môn học" });
    }

    // Tạo mã lớp học lại: HL_<ma_mon>
    const ten_lophocphan = `HL_${monHoc.ma_mon}`;
    const checkExist = await db.LopHocPhan.findOne({ where: { ten_lophocphan } });
    if (checkExist) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Lớp học lại đã tồn tại" });
    }

    const lophocphan_id = uuidv4();

    // Tạo lớp học phần
    await db.LopHocPhan.create({
      lophocphan_id,
      monhoc_id,
      giangvien_id,
      hocky_id,
      ten_lophocphan,
      thu,
      gio_batdau,
      gio_ketthuc,
      phong,
      ngay_tao: new Date()
    }, { transaction });

    // ===== Tạo buổi học =====
    const daysOfWeek = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    const targetDay = daysOfWeek[thu];
    if (targetDay === undefined) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Thứ không hợp lệ" });
    }

    let currentDate = dayjs(ngay_batdau);
    while (currentDate.day() !== targetDay) currentDate = currentDate.add(1, "day");

    const buoiList = [];
    for (let i = 0; i < so_tuan; i++) {
      const ngayHoc = currentDate.format("YYYY-MM-DD");
      buoiList.push({
        buoi_id: uuidv4(),
        lophocphan_id,
        ngay: ngayHoc,
        gio_batdau,
        gio_ketthuc
      });
      currentDate = currentDate.add(7, "day");
    }

    await db.BuoiHoc.bulkCreate(buoiList, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: `Tạo lớp học lại thành công: ${ten_lophocphan}`,
      data: {
        lophocphan_id,
        ten_lophocphan,
        so_buoi_hoc: so_tuan
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi tạo lớp học lại:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};





module.exports = {
  taoLopHocPhanVaBuoiHoc,
  capNhatBuoiHoc,
  huyBuoiHoc,
  xoaBuoiHoc,
  layDanhSachBuoiHoc,
  capNhatHangLoatBuoiHoc,
  taoLopHocLai
};
