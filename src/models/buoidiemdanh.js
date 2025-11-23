'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BuoiDiemDanh extends Model {
    static associate(models) {
      BuoiDiemDanh.belongsTo(models.PhanCongMon, { foreignKey: 'phancong_id' });
      BuoiDiemDanh.belongsTo(models.TaiKhoan, { foreignKey: 'nguoi_tao', as: 'NguoiTao' });
      BuoiDiemDanh.hasMany(models.ChiTietDiemDanh, { foreignKey: 'buoi_id' });
    }
  }
  BuoiDiemDanh.init({
    buoi_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    phancong_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'PhanCongMon', key: 'phancong_id' },
      onDelete: 'CASCADE'
    },
    ngay: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    batdau: DataTypes.DATE,
    ketthuc: DataTypes.DATE,
    trangthai: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    nguoi_tao: {
      type: DataTypes.UUID,
      references: { model: 'TaiKhoan', key: 'taikhoan_id' },
      onDelete: 'SET NULL'
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'BuoiDiemDanh',
    tableName: 'BuoiDiemDanh',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['phancong_id', 'ngay']
      }
    ]
  });
  return BuoiDiemDanh;
};