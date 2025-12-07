'use strict';
const db = require('../models');

const getSinhVienByLop = async (lop_hanhchinh_id) => {
    try {
        return await db.SinhVien.findAll({
            where: {
                lop_hanhchinh_id,
                isDeleted: false
            },
            order: [['ten', 'ASC']]
        });
    } catch (err) {
        throw new Error('Lỗi lấy danh sách sinh viên: ' + err.message);
    }
};

const createSinhVien = async (data) => {
    try {
        return await db.SinhVien.create({
            ma_sv: data.ma_sv,
            ten: data.ten,
            email: data.email,
            sdt: data.sdt,
            lop_hanhchinh_id: data.lop_hanhchinh_id,
            ngaysinh: data.ngaysinh,
            trang_thai: data.trang_thai || "Đang học"
        });
    } catch (err) {
        throw new Error('Lỗi thêm sinh viên: ' + err.message);
    }
};

const updateSinhVien = async (sinhvien_id, data) => {
    try {
        const sv = await db.SinhVien.findByPk(sinhvien_id);
        if (!sv) throw new Error('Không tìm thấy sinh viên');

        await sv.update(data);
        return sv;
    } catch (err) {
        throw new Error('Lỗi cập nhật sinh viên: ' + err.message);
    }
};

const softDeleteSinhVien = async (sinhvien_id) => {
    try {
        const sv = await db.SinhVien.findByPk(sinhvien_id);
        if (!sv) throw new Error('Không tìm thấy sinh viên');

        await sv.update({ isDeleted: true });
        return sv;
    } catch (err) {
        throw new Error('Lỗi xóa mềm sinh viên: ' + err.message);
    }
};

module.exports = {
    getSinhVienByLop,
    createSinhVien,
    updateSinhVien,
    softDeleteSinhVien
};
