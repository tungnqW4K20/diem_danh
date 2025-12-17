'use strict';
const db = require('../models');
const xlsx = require('xlsx');
const { Op } = require('sequelize');

const lopService = require('../services/lop.service');

const getAll = async (req, res, next) => {
    try {
        const data = await lopService.getAllLop();

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách lớp học thành công.',
            data: data
        });
    } catch (error) {
        console.error("Get All Lop Error:", error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ khi lấy danh sách lớp học.'
        });
    }
};

const getStudentsByClass = async (req, res, next) => {
    try {
        const { lop_id } = req.params;
        if (!lop_id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID của lớp trong đường dẫn.' });
        }

        const lop = await db.Lop.findByPk(lop_id);
        if (!lop) {
            return res.status(404).json({ success: false, message: `Không tìm thấy lớp học với ID ${lop_id}.` });
        }

        const data = await lopService.getStudentsByClassId(lop_id);
        
        
        res.status(200).json({
            success: true,
            message: `Lấy danh sách sinh viên của lớp '${lop.ten_lop}' thành công.`,
            data: data
        });
    } catch (error) {
        console.error("Get Students By Class ID Error:", error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ khi lấy danh sách sinh viên.'
        });
    }
};


// const createLop = async (req, res) => {
//   try {
//     const { ten_lop, nien_khoa, chuong_trinh, khoa_id, giangvien_id, ghichu,  } = req.body;

//     if (!ten_lop || !nien_khoa || !chuong_trinh) {
//       return res.status(400).json({
//         success: false,
//         message: 'ten_lop, nien_khoa và chuong_trinh là bắt buộc'
//       });
//     }

//     const newLop = await lopService.createLop({ ten_lop, nien_khoa, chuong_trinh, khoa_id, giangvien_id, ghichu });

//     return res.status(201).json({
//       success: true,
//       message: 'Tạo lớp thành công',
//       data: newLop
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const createLop = async (req, res) => {
  try {
    // Thêm chuyennganh_id và coso_id (nếu cần) vào destructuring
    const { ten_lop, nien_khoa, chuong_trinh, khoa_id, giangvien_id, ghichu, chuyennganh_id, coso_id } = req.body;

    if (!ten_lop || !nien_khoa || !chuong_trinh) {
      return res.status(400).json({
        success: false,
        message: 'ten_lop, nien_khoa và chuong_trinh là bắt buộc'
      });
    }

    const newLop = await lopService.createLop({ 
      ten_lop, nien_khoa, chuong_trinh, khoa_id, giangvien_id, ghichu, chuyennganh_id, coso_id 
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo lớp thành công',
      data: newLop
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// const importClasses = async (req, res) => {
//     const t = await db.sequelize.transaction(); // Bắt đầu Transaction
//     try {
//         if (!req.file) {
//             await t.rollback();
//             return res.status(400).json({ success: false, message: 'Vui lòng upload file excel.' });
//         }

//         // 1. Đọc file Excel từ buffer
//         const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];

//         // --- TÌM DÒNG HEADER ---
//         // Đọc dưới dạng mảng 2 chiều để tìm dòng chứa "MÃ LỚP"
//         const rawMatrix = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//         let headerRowIndex = -1;
//         for (let i = 0; i < rawMatrix.length; i++) {
//             const row = rawMatrix[i];
//             const isHeader = row.some(cell => 
//                 cell && cell.toString().trim().toUpperCase().includes('MÃ LỚP')
//             );
            
//             if (isHeader) {
//                 headerRowIndex = i;
//                 break;
//             }
//         }

//         if (headerRowIndex === -1) {
//             await t.rollback();
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Không tìm thấy cột "MÃ LỚP". Vui lòng kiểm tra lại file mẫu.' 
//             });
//         }

//         // Đọc dữ liệu từ dòng header tìm được
//         const rawData = xlsx.utils.sheet_to_json(worksheet, { range: headerRowIndex, defval: '' });

//         if (!rawData || rawData.length === 0) {
//             await t.rollback();
//             return res.status(400).json({ success: false, message: 'File excel không có dữ liệu.' });
//         }

//         // --- 2. CHUẨN BỊ LOOKUP DATA (SỬA LỖI TẠI ĐÂY) ---
//         // Lưu ý: Tôi đã xóa 'ma_coso' và 'ma_chuyennganh' để tránh lỗi nếu DB không có cột này
//         const [allKhoa, allCoSo, allChuyenNganh] = await Promise.all([
//             db.Khoa.findAll({ attributes: ['khoa_id', 'ma_khoa', 'ten_khoa'] }),
            
//             // SỬA LỖI: Chỉ lấy coso_id và ten_coso
//             db.CoSo.findAll({ attributes: ['coso_id', 'ten_coso'] }), 
            
//             // SỬA LỖI: Tạm thời bỏ ma_chuyennganh cho an toàn, nếu DB bạn có thì thêm vào lại
//             db.ChuyenNganh.findAll({ attributes: ['chuyennganh_id', 'ten_chuyennganh'] }) 
//         ]);

//         const preparedClasses = [];
//         const errors = [];

//         // Helper normalize string
//         const normalize = (str) => str ? str.toString().trim().toLowerCase() : '';

//         // 3. Duyệt từng dòng
//         for (let i = 0; i < rawData.length; i++) {
//             const rawRow = rawData[i];
//             const rowNumber = headerRowIndex + i + 2; 

//             // Chuẩn hóa tên cột (Trim space)
//             const row = {};
//             Object.keys(rawRow).forEach(key => {
//                 row[key.trim()] = rawRow[key];
//             });

//             // Map cột Excel
//             const tenLop = row['MÃ LỚP'];
//             const heDT = row['HỆ ĐT']; 
//             const khoaStr = row['KHÓA']; 
//             const donViMa = row['ĐƠN VỊ']; 
//             const coSoTen = row['CƠ SỞ']; 
//             const chuyenNganhTen = row['Chuyên ngành']; 
//             const siSo = row['SĨ SỐ']; 

//             if (!tenLop && !donViMa) continue; // Bỏ qua dòng trống

//             // Validate
//             if (!tenLop) {
//                 errors.push(`Dòng ${rowNumber}: Thiếu "MÃ LỚP"`);
//                 continue;
//             }

//             // --- Logic Lookup ID ---
            
//             // 1. Tìm Khoa (Theo mã hoặc tên)
//             let foundKhoa = null;
//             if (donViMa) {
//                 const searchKey = normalize(donViMa);
//                 foundKhoa = allKhoa.find(k => 
//                     normalize(k.ma_khoa) === searchKey || normalize(k.ten_khoa) === searchKey
//                 );
//             }
//             if (!foundKhoa && donViMa) errors.push(`Dòng ${rowNumber}: Không tìm thấy Đơn vị "${donViMa}"`);

//             // 2. Tìm Cơ Sở (Chỉ tìm theo tên vì DB không có ma_coso)
//             let foundCoSo = null;
//             if (coSoTen) {
//                 const searchKey = normalize(coSoTen);
//                 foundCoSo = allCoSo.find(cs => normalize(cs.ten_coso) === searchKey);
//             }
//             if (!foundCoSo && coSoTen) errors.push(`Dòng ${rowNumber}: Không tìm thấy Cơ sở "${coSoTen}"`);

//             // 3. Tìm Chuyên Ngành (Tìm theo tên)
//             let foundChuyenNganh = null;
//             if (chuyenNganhTen) {
//                 const searchKey = normalize(chuyenNganhTen);
//                 foundChuyenNganh = allChuyenNganh.find(cn => normalize(cn.ten_chuyennganh) === searchKey);
//             }

//             // 4. Xử lý Niên khóa
//             let nienKhoaInt = new Date().getFullYear();
//             if (khoaStr) {
//                 const matchParens = khoaStr.toString().match(/\((\d{2})-/); 
//                 const matchFull = khoaStr.toString().match(/20\d{2}/); 
                
//                 if (matchParens && matchParens[1]) {
//                     nienKhoaInt = 2000 + parseInt(matchParens[1]);
//                 } else if (matchFull) {
//                     nienKhoaInt = parseInt(matchFull[0]);
//                 }
//             }

//             if (errors.length > 0) continue; 

//             // Push Data
//             preparedClasses.push({
//                 lop_hanhchinh_id: db.Sequelize.literal('UUID()'),
//                 ten_lop: tenLop,
//                 nien_khoa: nienKhoaInt,
//                 chuong_trinh: heDT || 'Đại học',
//                 khoa_id: foundKhoa ? foundKhoa.khoa_id : null,
//                 coso_id: foundCoSo ? foundCoSo.coso_id : null,
//                 chuyennganh_id: foundChuyenNganh ? foundChuyenNganh.chuyennganh_id : null,
//                 si_so: parseInt(siSo) || 0,
//                 ghichu: `Import Excel: ${khoaStr || ''}`,
//                 ngay_tao: new Date(),
//                 isDeleted: false
//             });
//         }

//         // 4. Kiểm tra lỗi
//         if (errors.length > 0) {
//             await t.rollback();
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Dữ liệu Excel không hợp lệ.', 
//                 details: errors 
//             });
//         }

//         if (preparedClasses.length === 0) {
//             await t.rollback();
//             return res.status(400).json({ success: false, message: 'Không tìm thấy dữ liệu hợp lệ để import.' });
//         }

//         // 5. Bulk Create
//         await db.LopHanhChinh.bulkCreate(preparedClasses, { 
//             transaction: t,
//             // updateOnDuplicate: ['nien_khoa', 'si_so'] // Bật cái này nếu DB có unique key ten_lop
//         });

//         await t.commit();

//         return res.status(200).json({
//             success: true,
//             message: `Import thành công ${preparedClasses.length} lớp học.`
//         });

//     } catch (error) {
//         await t.rollback();
//         console.error("Import Class Error:", error);
//         return res.status(500).json({ 
//             success: false, 
//             message: 'Lỗi server: ' + (error.original?.sqlMessage || error.message) 
//         });
//     }
// };


// Chuyển tiếng Việt có dấu sang không dấu, giữ nguyên case
const toNonAccent = (str) => {
    if (!str) return '';
    str = str.toString();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
};

const normalize = (str) => {
    if (!str) return '';
    let s = toNonAccent(str).toLowerCase();
    s = s.replace(/[^a-z0-9]/g, ""); 
    return s;
}

const findVal = (row, keywords) => {
    if (!Array.isArray(keywords)) keywords = [keywords];
    const keys = Object.keys(row);
    for (const kw of keywords) {
        const cleanKw = kw.replace(/\s/g, ''); 
        const foundKey = keys.find(k => {
            const cleanK = toNonAccent(k).toLowerCase().replace(/\s/g, '');
            return cleanK.includes(cleanKw);
        });
        if (foundKey) return row[foundKey];
    }
    return undefined;
};

// ============================================================================
// 2. MAIN IMPORT FUNCTION (ĐÃ RÚT GỌN)
// ============================================================================

const importClasses = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        if (!req.file) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Vui lòng upload file excel.' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawMatrix = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        let headerRowIndex = -1;

        for (let i = 0; i < rawMatrix.length; i++) {
            const row = rawMatrix[i];
            const isHeader = row.some(cell => cell && toNonAccent(cell).toLowerCase().replace(/\s/g,'').includes('malop'));
            if (isHeader) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Không tìm thấy cột "Mã Lớp" trong file.' });
        }

        const rawData = xlsx.utils.sheet_to_json(worksheet, { range: headerRowIndex, defval: '' });

        // Load dữ liệu
        const [allKhoa, allCoSo, allChuyenNganh, existingClasses] = await Promise.all([
            db.Khoa.findAll({ attributes: ['khoa_id', 'ma_khoa', 'ten_khoa'] }),
            db.CoSo.findAll({ attributes: ['coso_id', 'ten_coso'] }), 
            db.ChuyenNganh.findAll({ attributes: ['chuyennganh_id', 'ten_chuyennganh'] }),
            // Lấy danh sách lớp đã có để tránh trùng
            db.LopHanhChinh.findAll({ attributes: ['ten_lop'] }) 
        ]);

        // Tạo Set chứa tên lớp đã có trong DB để check nhanh
        const existingClassNames = new Set(existingClasses.map(c => c.ten_lop.trim().toUpperCase()));
        
        // Tạo Set để check trùng lặp trong chính file Excel (tránh 1 lớp xuất hiện 2 lần trong file)
        const currentFileClassNames = new Set();

        const preparedClasses = [];
        
        for (let i = 0; i < rawData.length; i++) {
            const rawRow = rawData[i];
            const tenLop = findVal(rawRow, ["malop", "lop"]); 
            
            // 1. Skip dòng trống
            if (!tenLop) continue;

            const cleanTenLop = tenLop.toString().trim();
            const upperTenLop = cleanTenLop.toUpperCase();

            // 2. CHECK TRÙNG LẶP (QUAN TRỌNG)
            // Nếu lớp đã có trong DB -> Bỏ qua (hoặc update tùy logic)
            if (existingClassNames.has(upperTenLop)) {
                console.log(`⚠️ Bỏ qua lớp trùng: ${cleanTenLop}`);
                continue; 
            }

            // Nếu lớp đã có trong danh sách chuẩn bị insert (trùng trong file excel) -> Bỏ qua
            if (currentFileClassNames.has(upperTenLop)) {
                continue;
            }
            currentFileClassNames.add(upperTenLop);

            // ... (Logic tìm Khoa, Cơ sở, Ngành giữ nguyên) ...
            const donViName = findVal(rawRow, ["donvi", "khoa", "vien", "dv"]); 
            const coSoTen = findVal(rawRow, ["coso", "diadiem"]); 
            const chuyenNganhTen = findVal(rawRow, ["chuyennganh", "nganh"]); 
            const heDT = findVal(rawRow, ["hedt", "he"]); 
            const khoaStr = findVal(rawRow, ["khoa", "khoahoc"]); 
            const siSo = findVal(rawRow, ["siso", "sl"]); 

            // A. Tìm Khoa
            let khoaId = null;
            if (donViName) {
                const searchKey = normalize(donViName);
                const found = allKhoa.find(k => normalize(k.ma_khoa) === searchKey || normalize(k.ten_khoa) === searchKey);
                if (found) khoaId = found.khoa_id;
            }

            // B. Tìm Chuyên Ngành
            let cnId = null;
            if (chuyenNganhTen) {
                const searchKey = normalize(chuyenNganhTen);
                const found = allChuyenNganh.find(cn => normalize(cn.ten_chuyennganh) === searchKey);
                if (found) cnId = found.chuyennganh_id;
            }

            // C. Tìm Cơ Sở
            let cosoId = null;
            if (coSoTen) {
                const searchKey = normalize(coSoTen);
                let found = allCoSo.find(cs => normalize(cs.ten_coso) === searchKey);
                if (!found) {
                     const locationName = searchKey.replace(/^(cs|coso)/, ''); 
                     if (locationName.length > 2) { 
                         found = allCoSo.find(cs => normalize(cs.ten_coso).includes(locationName));
                     }
                }
                if (found) cosoId = found.coso_id;
            }

            // D. Niên khóa
            let nienKhoaInt = new Date().getFullYear();
            if (khoaStr) {
                const matchParens = khoaStr.toString().match(/\((\d{2})-/); 
                const matchFull = khoaStr.toString().match(/20\d{2}/); 
                if (matchParens && matchParens[1]) nienKhoaInt = 2000 + parseInt(matchParens[1]);
                else if (matchFull) nienKhoaInt = parseInt(matchFull[0]);
            }

            preparedClasses.push({
                lop_hanhchinh_id: db.Sequelize.literal('UUID()'),
                ten_lop: cleanTenLop,
                nien_khoa: nienKhoaInt,
                chuong_trinh: heDT || 'Đại học',
                khoa_id: khoaId,
                coso_id: cosoId,
                chuyennganh_id: cnId,
                si_so: parseInt(siSo) || 0,
                ghichu: `Import Excel: ${khoaStr || ''}`,
                ngay_tao: new Date(),
                isDeleted: false
            });
        }

        if (preparedClasses.length === 0) {
            await t.rollback();
            // Thông báo rõ ràng hơn
            return res.status(200).json({ 
                success: true, 
                message: 'File không có lớp mới nào (Tất cả đã tồn tại trong hệ thống).' 
            });
        }

        await db.LopHanhChinh.bulkCreate(preparedClasses, { transaction: t });
        await t.commit();

        return res.status(200).json({
            success: true,
            message: `Import thành công ${preparedClasses.length} lớp học mới.`
        });

    } catch (error) {
        await t.rollback();
        console.error("Import Error:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};





module.exports = {
    getAll,
    createLop,
    getStudentsByClass,
    importClasses
};