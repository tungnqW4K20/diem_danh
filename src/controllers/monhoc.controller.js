const monHocService = require('../services/monhoc.service');
const db = require('../models');
const xlsx = require('xlsx');



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

// Chuyển tiếng Việt có dấu thành không dấu
const toNonAccent = (str) => {
    if (!str) return '';
    str = str.toString().trim();
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D");
};

const normalize = (str) => {
    if (!str) return '';
    return toNonAccent(str).toLowerCase().replace(/[^a-z0-9]/g, "");
};

const findValueInRow = (row, keywords) => {
    if (!row || typeof row !== 'object') return undefined;
    
    const keys = Object.keys(row);
    for (const kw of keywords) {
        const cleanKw = normalize(kw); 
        const foundKey = keys.find(k => normalize(k).includes(cleanKw));
        if (foundKey) return row[foundKey];
    }
    return undefined;
};



const importMonHocExcel = async (req, res) => {
    // 🔥 FIX LỖI UUID: Sử dụng dynamic import bên trong hàm async
    const { v4: uuidv4 } = await import('uuid');

    // Khởi tạo transaction để đảm bảo an toàn dữ liệu
    const transaction = await db.sequelize.transaction();
    
    try {
        // Kiểm tra file
        if (!req.file) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Vui lòng upload file excel.' });
        }

        // 1. Đọc file Excel từ Buffer
        let workbook;
        try {
            workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        } catch (e) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'File bị lỗi, không thể đọc dữ liệu.' });
        }

        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];
        
        // Chuyển Sheet thành JSON
        const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawData.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'File Excel rỗng.' });
        }

        // 2. Lấy dữ liệu tham chiếu từ DB (Khoa & Môn hiện có)
        const [allKhoa, existingMons] = await Promise.all([
            db.Khoa.findAll({ attributes: ['khoa_id', 'ten_khoa', 'ma_khoa'] }),
            db.MonHoc.findAll({ attributes: ['ma_mon'] })
        ]);

        // Tạo Set chứa mã môn đã tồn tại để check nhanh O(1)
        const existingCodes = new Set(existingMons.map(m => normalize(m.ma_mon)));
        
        const listToInsert = [];
        let duplicateCount = 0;
        let successCount = 0;

        // 3. Duyệt từng dòng và xử lý
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];

            // Tìm dữ liệu theo các tên cột có thể xảy ra
            const maMonVal = findValueInRow(row, ['mamon', 'code', 'ma_mon', 'mm']);
            const tenMonVal = findValueInRow(row, ['tenmon', 'name', 'ten_mon', 'tm', 'ten']);
            const soTCVal = findValueInRow(row, ['sotc', 'tinchi', 'credits', 'so_tin_chi', 'so_tc']);
            const tenKhoaVal = findValueInRow(row, ['khoa', 'donvi', 'department']);

            // Validate bắt buộc: Phải có Mã và Tên
            if (!maMonVal || !tenMonVal) {
                continue; // Bỏ qua dòng lỗi/trống
            }

            const cleanMaMon = maMonVal.toString().trim();
            const cleanMaMonCheck = normalize(cleanMaMon);

            // Check trùng: Nếu đã có trong DB hoặc đã có trong danh sách chuẩn bị insert
            if (existingCodes.has(cleanMaMonCheck)) {
                duplicateCount++;
                continue; 
            }

            // Xử lý Khoa (Map tên khoa sang ID)
            let khoaId = null;
            if (tenKhoaVal) {
                const searchKey = normalize(tenKhoaVal);
                // Logic tìm khoa: So sánh tên hoặc mã
                const foundKhoa = allKhoa.find(k => 
                    normalize(k.ten_khoa).includes(searchKey) || 
                    normalize(k.ma_khoa) === searchKey ||
                    searchKey.includes(normalize(k.ten_khoa)) // Tìm ngược lại
                );
                if (foundKhoa) khoaId = foundKhoa.khoa_id;
            }

            // Xử lý Số tín chỉ
            let tinChi = parseInt(soTCVal);
            if (isNaN(tinChi)) tinChi = 0; // Mặc định 0 nếu lỗi

            // Thêm vào danh sách insert
            listToInsert.push({
                monhoc_id: uuidv4(), // Sử dụng hàm uuidv4 đã import động
                ma_mon: cleanMaMon,
                ten_mon: tenMonVal.toString().trim(),
                sotinchi: tinChi,
                khoa_id: khoaId,
                mota: 'Imported via Excel',
                isDeleted: false
            });

            // Đánh dấu mã này đã được xử lý (để tránh trùng lặp trong chính file excel)
            existingCodes.add(cleanMaMonCheck);
            successCount++;
        }

        // 4. Insert vào DB
        if (listToInsert.length > 0) {
            await db.MonHoc.bulkCreate(listToInsert, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: `Import thành công.`,
            data: {
                total_rows: rawData.length,
                inserted: successCount,
                duplicates_skipped: duplicateCount
            }
        });

    } catch (error) {
        // Rollback nếu có lỗi nghiêm trọng
        if (transaction) await transaction.rollback();
        console.error("Lỗi Import MonHoc:", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi server khi import: ' + error.message 
        });
    }
};


module.exports = {
    handleGetAll,
    handleGetById,
    handleCreate,
    handleUpdate,
    handleDelete,
    importMonHocExcel
};