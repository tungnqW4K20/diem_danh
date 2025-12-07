// routes/lophocphan.route.js
const express = require("express");
const router = express.Router();
const lopHocPhanController = require("../controllers/lophocphan.controller");

router.get("/:lophocphan_id/sinhvien", lopHocPhanController.getStudentsByLopHocPhan);

module.exports = router;
