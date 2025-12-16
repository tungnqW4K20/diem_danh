'use strict';

const express = require('express');
const lopController = require('../controllers/lop.controller');
const upload = require('../middlewares/upload.middleware'); 

const router = express.Router();
router.get('/', lopController.getAll);
router.get('/:lop_id/sinhvien', lopController.getStudentsByClass);
router.post('/', lopController.createLop);
router.post('/import', upload.single('file'), lopController.importClasses);

module.exports = router;