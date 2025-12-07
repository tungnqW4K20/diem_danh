'use strict';
const db = require('../models');
// const getAllLop = async () => {
//     try {
//         const lopList = await db.Lop.findAll({
//             order: [
//                 ['nien_khoa', 'DESC'],
//                 ['ten_lop', 'ASC']
//             ],
//             attributes: ['lop_id', 'ten_lop', 'nien_khoa', 'chuong_trinh']
//         });
//         return lopList;
//     } catch (error) {
//         throw new Error(`Lỗi khi truy vấn danh sách lớp học: ${error.message}`);
//     }
// };


// const getAllLop = async () => {
//     try {
//         // THAY ĐỔI TỪ db.Lop THÀNH db.LopHanhChinh
//         const lopList = await db.LopHanhChinh.findAll({
//             order: [
//                 ['nien_khoa', 'DESC'],
//                 ['ten_lop', 'ASC']
//             ],
//             // Sửa lại tên trường ID cho khớp với model LopHanhChinh
//             attributes: ['lop_hanhchinh_id', 'ten_lop', 'nien_khoa', 'chuong_trinh','khoa_id'],
//             include: [
//                 {
//                     model: db.Khoa,
//                     as: 'khoa', 
//                     attributes: ['khoa_id', 'ten_khoa', 'ma_khoa'] 
//                 }
//             ],
//         });
        
//         return lopList;
//     } catch (error) {
//         throw new Error(`Lỗi khi truy vấn danh sách lớp học: ${error.message}`);
//     }
// };


const getAllLop = async () => {
  try {
    // 1️⃣ Lấy dữ liệu
    const lopList = await db.LopHanhChinh.findAll({
      order: [
        ['nien_khoa', 'DESC'],
        ['ten_lop', 'ASC']
      ],
      attributes: [
        'lop_hanhchinh_id',
        'ten_lop',
        'nien_khoa',
        'chuong_trinh',
        'khoa_id',
        'giangvien_id',

        // 🟢 SĨ SỐ SINH VIÊN
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM SinhVien AS sv 
            WHERE sv.lop_hanhchinh_id = LopHanhChinh.lop_hanhchinh_id
            AND sv.isDeleted = 0
          )`),
          'si_so'
        ]
      ],
      include: [
        // 🟢 Thông tin Khoa
        {
          model: db.Khoa,
          as: 'Khoa',
          attributes: ['khoa_id', 'ten_khoa', 'ma_khoa']
        },

        // 🟢 Thông tin Giảng viên chủ nhiệm
        {
          model: db.GiangVien,
          as: 'GVCN',
          attributes: ['giangvien_id', 'ho', 'ten', 'email', 'sdt']
        }
      ]
    });

    // 2️⃣ Ghép họ + tên thành ho_ten
    const lopListWithHoTen = lopList.map(lop => {
      const lopJson = lop.toJSON();
      if (lopJson.GVCN) {
        lopJson.GVCN.ho_ten = `${lopJson.GVCN.ho} ${lopJson.GVCN.ten}`;
      }
      return lopJson;
    });

    return {
      success: true,
      message: "Lấy danh sách lớp học thành công.",
      data: lopListWithHoTen
    };

  } catch (error) {
    return {
      success: false,
      message: `Lỗi khi truy vấn danh sách lớp học: ${error.message}`,
      data: []
    };
  }
};


const getStudentsByClassId = async (lophocphan_id) => {
  return await db.DangKyHoc.findAll({
    where: { lophocphan_id },
    include: [
      {
        model: db.SinhVien,
        attributes: ["sinhvien_id", "ma_sv", "ho", "ten", "email", "sdt"]
      }
    ]
  });
};


const createLop = async (data) => {
  try {
    const newLop = await db.LopHanhChinh.create({
      ten_lop: data.ten_lop,
      nien_khoa: data.nien_khoa,
      chuong_trinh: data.chuong_trinh,
      khoa_id: data.khoa_id || null,
      giangvien_id: data.giangvien_id || null,
      ghichu: data.ghichu || null
    });

    return newLop;
  } catch (error) {
    throw new Error(`Lỗi khi tạo lớp: ${error.message}`);
  }
};




module.exports = {
    getAllLop,
    getStudentsByClassId,
    createLop
};

