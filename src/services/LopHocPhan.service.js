const db = require('../models');




// const getStudentsByLopHocPhan = async (lophocphan_id, ngay) => {
//   try {
//     return await db.DangKyHoc.findAll({
//       where: { lophocphan_id },
//       include: [
//         {
//           model: db.SinhVien,
//           as: "SinhVien",
//           attributes: ["sinhvien_id", "ma_sv", "ten", "email", "sdt", "ngaysinh"],
//           include: [
//             {
//               model: db.DiemDanh,
//               as: "DanhSachDiemDanh",
//               where: { ngay }, 
//               required: false
//             }
//           ]
//         }
//       ],
//       order: [[db.SinhVien, "ten", "ASC"]]
//     });
//   } catch (error) {
//     throw new Error(`Lỗi truy vấn sinh viên lớp học phần: ${error.message}`);
//   }
// };

const getStudentsByLopHocPhan = async (lophocphan_id, ngay) => {
  try {
    return await db.DangKyHoc.findAll({
      where: { lophocphan_id },
      include: [
        {
          model: db.SinhVien,
          as: "SinhVien",
          attributes: ["sinhvien_id", "ma_sv", "ten", "email", "sdt"],
          include: [
            {
              model: db.DiemDanh,
              as: "DanhSachDiemDanh",
              required: false,
              include: [
                {
                  model: db.BuoiHoc,
                  as: "BuoiHoc",
                  where: { ngay },
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [[db.SinhVien, "ten", "ASC"]]
    });
  } catch (error) {
    throw new Error(`Lỗi truy vấn sinh viên lớp học phần: ${error.message}`);
  }
};
module.exports = { getStudentsByLopHocPhan };


