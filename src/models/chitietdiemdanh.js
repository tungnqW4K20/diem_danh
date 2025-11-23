'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietDiemDanh extends Model {
    static associate(models) {
      ChiTietDiemDanh.belongsTo(models.BuoiDiemDanh, { foreignKey: 'buoi_id' });
      ChiTietDiemDanh.belongsTo(models.SinhVien, { foreignKey: 'sinhvien_id' });
      // Mối quan hệ với TaiKhoan (người điểm danh)
      ChiTietDiemDanh.belongsTo(models.TaiKhoan, { foreignKey: 'nguoi_danhdau', as: 'NguoiDanhDau' });
    }
  }
  ChiTietDiemDanh.init({
    chitiet_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    buoi_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'BuoiDiemDanh', key: 'buoi_id' },
      onDelete: 'CASCADE'
    },
    sinhvien_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'SinhVien', key: 'sinhvien_id' },
      onDelete: 'CASCADE'
    },
    trangthai: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false
    },
    ghichu: DataTypes.STRING(255),
    thoigian_danhdau: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    nguoi_danhdau: {
      type: DataTypes.UUID,
      references: { model: 'TaiKhoan', key: 'taikhoan_id' },
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'ChiTietDiemDanh',
    tableName: 'ChiTietDiemDanh',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['buoi_id', 'sinhvien_id']
      }
    ]
  });
  return ChiTietDiemDanh;
};