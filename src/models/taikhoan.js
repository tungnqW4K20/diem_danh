'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaiKhoan extends Model {
    static associate(models) {
      TaiKhoan.hasMany(models.BuoiDiemDanh, { foreignKey: 'nguoi_tao', as: 'BuoiDiemDanhDaTao' });
      TaiKhoan.hasMany(models.ChiTietDiemDanh, { foreignKey: 'nguoi_danhdau', as: 'ChiTietDiemDanhDaThucHien' });
       // 🔥 Thêm association với GiangVien
      TaiKhoan.belongsTo(models.GiangVien, {
        foreignKey: 'lienket_id',
        targetKey: 'giangvien_id',
        as: 'GiangVien',
         onDelete: "SET NULL",
  onUpdate: "CASCADE"
      });
    
    }
  }
  TaiKhoan.init({
    taikhoan_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255)
    },
    vaitro: {
      type: DataTypes.ENUM('admin', 'giangvien','sinhvien'),
      allowNull: false
    },
    lienket_id: {
      type: DataTypes.UUID
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'TaiKhoan',
    tableName: 'TaiKhoan',
    timestamps: false
  });
  return TaiKhoan;
};