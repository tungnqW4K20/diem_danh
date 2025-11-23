'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lop extends Model {
    static associate(models) {
      Lop.hasMany(models.SinhVien, { foreignKey: 'lop_id' });
      Lop.hasMany(models.PhanCongMon, { foreignKey: 'lop_id' });
      Lop.hasMany(models.DangKyHoc, { foreignKey: 'lop_id' });
    }
  }
  Lop.init({
    lop_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    ten_lop: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nien_khoa: {
      type: DataTypes.INTEGER
    },
    chuong_trinh: {
      type: DataTypes.STRING(100)
    },
    ghichu: {
      type: DataTypes.TEXT
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Lop',
    tableName: 'Lop',
    timestamps: false
  });
  return Lop;
};


