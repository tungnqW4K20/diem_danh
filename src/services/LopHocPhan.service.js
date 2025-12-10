const db = require('../models');
const { Op } = require('sequelize');


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

const getAllLopHocPhan = async (query) => {
    try {
        const { hocky_id, giangvien_id, khoa_id } = query;
        const whereClause = {};

        if (hocky_id) {
            whereClause.hocky_id = hocky_id;
        }

        if (giangvien_id) {
            whereClause.giangvien_id = giangvien_id;
        }
        const data = await db.LopHocPhan.findAll({
            where: whereClause,
            include: [
                {
                    model: db.MonHoc,
                    attributes: ['monhoc_id', 'ma_mon', 'ten_mon', 'sotinchi'],
                    include: [
                        {
                            model: db.Khoa,
                            as: 'Khoa', 
                            attributes: ['khoa_id', 'ten_khoa', 'ma_khoa']
                        }
                    ]
                },
                {
                    model: db.LopHanhChinh,
                    as: 'LopHanhChinh',
                    attributes: ['lop_hanhchinh_id', 'ten_lop'],
                    include: [
                        {
                            model: db.Khoa,
                            as: 'Khoa', 
                            attributes: ['khoa_id', 'ten_khoa', 'ma_khoa']
                        }
                    ]
                },
                {
                    model: db.GiangVien,
                    attributes: ['giangvien_id', 'ma_gv', 'ho', 'ten', 'email']
                },
                {
                    model: db.HocKy,
                    attributes: ['hocky_id', 'ten_hocky']
                }
            ],
            order: [['ngay_tao', 'DESC']]
        });

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('Service Error:', error);
        throw error;
    }
};


const getAllLopHocLai = async () => {
  return await db.LopHocPhan.findAll({
    where: {
      ten_lophocphan: { [Op.like]: 'HL_%' } // lớp học lại bắt đầu bằng HL_
    },
    order: [['ten_lophocphan', 'ASC']]
  });
};

// Lấy sinh viên trong lớp học lại
const getSinhVienByLopHocLai = async (lophocphan_id) => {
  return await db.DangKyHoc.findAll({
    where: { lophocphan_id },
    include: [
      {
        model: db.SinhVien,
        as: 'SinhVien',
        attributes: ['sinhvien_id', 'ten_sinhvien', 'lop_hanhchinh_id'],
        include: [
          {
            model: db.LopHanhChinh,
            as: 'LopHanhChinh',
            attributes: ['ten_lop', 'khoa_id'],
            include: [
              {
                model: db.Khoa,
                as: 'Khoa',
                attributes: ['ten_khoa']
              }
            ]
          }
        ]
      }
    ]
  });
};


module.exports = { 
  getStudentsByLopHocPhan,
  getAllLopHocPhan,
  getAllLopHocLai,
  getSinhVienByLopHocLai   
};


