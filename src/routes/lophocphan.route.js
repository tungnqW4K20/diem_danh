const express = require("express");
const router = express.Router();
const lopHocPhanController = require("../controllers/lophocphan.controller");

router.get("/:lophocphan_id/sinhvien", lopHocPhanController.getStudentsByLopHocPhan);

router.get("/", lopHocPhanController.getAll);
router.get("/lop-hoc-lai", lopHocPhanController.layDanhSachLopHocLai);
router.get('/lop-hoc-lai/:lophocphan_id/sinhvien', lopHocPhanController.laySinhVienLopHocLai);

module.exports = router;


