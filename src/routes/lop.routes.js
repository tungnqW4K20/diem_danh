'use strict';

const express = require('express');
const lopController = require('../controllers/lop.controller');

const router = express.Router();
router.get('/', lopController.getAll);
router.get('/:lop_id/sinhvien', lopController.getStudentsByClass);
router.post('/', lopController.createLop);

module.exports = router;