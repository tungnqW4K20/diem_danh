'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HocKy extends Model {
    static associate(models) {
      // Một học kỳ có nhiều phân công môn học
      HocKy.hasMany(models.PhanCongMon, { foreignKey: 'hocky_id' });
    }
  }
  HocKy.init({
    hocky_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    ten_hocky: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ngay_batdau: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ngay_ketthuc: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'HocKy',
    tableName: 'HocKy',
    timestamps: false 
  });
  return HocKy;
};