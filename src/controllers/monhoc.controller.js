const monHocService = require('../services/monhoc.service');

const handleGetAll = async (req, res) => {
    try {
        const response = await monHocService.getAllMonHoc(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.error('GetAll MonHoc Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách' });
    }
};

const handleGetById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await monHocService.getMonHocById(id);
        if (!response.success) {
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('GetById MonHoc Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

const handleCreate = async (req, res) => {
    try {
        const { ma_mon, ten_mon, sotinchi, khoa_id } = req.body;
        
        if (!ma_mon || !ten_mon || !sotinchi) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' });
        }

        const response = await monHocService.createMonHoc(req.body);
        if (!response.success) {
            return res.status(400).json(response); 
        }
        return res.status(201).json(response);
    } catch (error) {
        console.error('Create MonHoc Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi tạo mới' });
    }
};

const handleUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await monHocService.updateMonHoc(id, req.body);
        if (!response.success) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Update MonHoc Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật' });
    }
};

const handleDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await monHocService.deleteMonHoc(id);
        if (!response.success) {
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Delete MonHoc Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xóa' });
    }
};



module.exports = {
    handleGetAll,
    handleGetById,
    handleCreate,
    handleUpdate,
    handleDelete
};