'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MonHoc extends Model {
    static associate(models) {
      // Một môn học có thể được phân công nhiều lần
      MonHoc.hasMany(models.PhanCongMon, { foreignKey: 'monhoc_id' });
    }
  }
  MonHoc.init({
    monhoc_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    ma_mon: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    ten_mon: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sotinchi: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    mota: {
      type: DataTypes.TEXT
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'MonHoc',
    tableName: 'MonHoc',
    timestamps: false
  });
  return MonHoc;
};