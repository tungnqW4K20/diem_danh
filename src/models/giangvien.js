'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GiangVien extends Model {
    static associate(models) {
      // Một giảng viên được phân công dạy nhiều môn
      GiangVien.hasMany(models.PhanCongMon, { foreignKey: 'giangvien_id' });
         GiangVien.hasOne(models.TaiKhoan, {
        foreignKey: 'lienket_id',
        sourceKey: 'giangvien_id',
        as: 'TaiKhoan',
         onDelete: "SET NULL",
  onUpdate: "CASCADE"
      });
    }
  }
  GiangVien.init({
    giangvien_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    ma_gv: {
      type: DataTypes.STRING(50),
      unique: true
    },
    ho: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ten: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150)
    },
    sdt: {
      type: DataTypes.STRING(50)
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'GiangVien',
    tableName: 'GiangVien',
    timestamps: false
  });
  return GiangVien;
};

