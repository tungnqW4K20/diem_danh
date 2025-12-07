'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LopHanhChinh extends Model {
    static associate(models) {
      LopHanhChinh.hasMany(models.SinhVien, {
        foreignKey: 'lop_hanhchinh_id',
        as: 'DanhSachSinhVien'
      });
      LopHanhChinh.belongsTo(models.Khoa, {
        foreignKey: 'khoa_id',
        as: 'Khoa'
      });
      LopHanhChinh.belongsTo(models.GiangVien, {
        foreignKey: 'giangvien_id',
        as: 'GVCN'
      });
    }
  }

  LopHanhChinh.init(
    {
      lop_hanhchinh_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      khoa_id: {
        type: DataTypes.UUID,
        allowNull: true 
      },
      ten_lop: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      nien_khoa: DataTypes.INTEGER,
      chuong_trinh: DataTypes.STRING(100),
      ghichu: DataTypes.TEXT,
      ngay_tao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Mặc định là chưa xóa
        allowNull: false
      },
      giangvien_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: 'LopHanhChinh',
      tableName: 'LopHanhChinh',
      timestamps: false,
      
    }
  );

  return LopHanhChinh;
};
