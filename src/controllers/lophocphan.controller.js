// controllers/lophocphan.controller.js
const lopHocPhanService = require('../services/LopHocPhan.service');

const getStudentsByLopHocPhan = async (req, res) => {
  try {
    const { lophocphan_id } = req.params;
    const { ngay } = req.query; 

    if (!lophocphan_id) {
      return res.status(400).json({ success: false, message: "Thiếu lophocphan_id" });
    }

    const data = await lopHocPhanService.getStudentsByLopHocPhan(lophocphan_id, ngay);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sinh viên lớp học phần thành công.",
      data: data.map(item => item.SinhVien) // chỉ trả sinh viên
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getStudentsByLopHocPhan };
