const express = require("express");
const router = express.Router();
const lopHocPhanController = require("../controllers/lophocphan.controller");

router.get("/:lophocphan_id/sinhvien", lopHocPhanController.getStudentsByLopHocPhan);

router.get("/", lopHocPhanController.getAll);

module.exports = router;


