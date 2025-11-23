'use strict';
const db = require('../models');
const getAllLop = async () => {
    try {
        const lopList = await db.Lop.findAll({
            order: [
                ['nien_khoa', 'DESC'],
                ['ten_lop', 'ASC']
            ],
            attributes: ['lop_id', 'ten_lop', 'nien_khoa', 'chuong_trinh']
        });
        return lopList;
    } catch (error) {
        throw new Error(`Lỗi khi truy vấn danh sách lớp học: ${error.message}`);
    }
};


const getStudentsByClassId = async (lop_id) => {
    try {
        const studentList = await db.SinhVien.findAll({
            where: {
                lop_id: lop_id
            },
            order: [
                ['ten', 'ASC'],
                ['ho', 'ASC']
            ]
        });
        return studentList;
    } catch (error) {
        throw new Error(`Lỗi khi truy vấn danh sách sinh viên: ${error.message}`);
    }
};






module.exports = {
    getAllLop,
    getStudentsByClassId
};

