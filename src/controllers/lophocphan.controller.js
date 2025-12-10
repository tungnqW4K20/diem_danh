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


const getAll = async (req, res) => {
    try {
        const query = req.query;
        const result = await lopHocPhanService.getAllLopHocPhan(query);

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách lớp học phần thành công',
            data: result.data
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};



const layDanhSachLopHocLai = async (req, res) => {
  try {
    const lopHocLaiList = await lopHocPhanService.getAllLopHocLai();
    res.json({
      success: true,
      data: lopHocLaiList
    });
  } catch (error) {
    console.error('Lỗi lấy lớp học lại:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/lophoclai/:lophocphan_id/sinhvien
const laySinhVienLopHocLai = async (req, res) => {
  try {
    const { lophocphan_id } = req.params;
    const svList = await lopHocPhanService.getSinhVienByLopHocLai(lophocphan_id);
    res.json({
      success: true,
      data: svList
    });
  } catch (error) {
    console.error('Lỗi lấy sinh viên lớp học lại:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




module.exports = { 
  getStudentsByLopHocPhan,
  getAll,
  layDanhSachLopHocLai,
  laySinhVienLopHocLai  
 };
