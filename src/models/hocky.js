'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HocKy extends Model {
    static associate(models) {
      HocKy.hasMany(models.LopHocPhan, {
        foreignKey: 'hocky_id',
        as: 'DanhSachHocPhan'
      });
    }
  }

  HocKy.init(
    {
      hocky_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      ten_hocky: DataTypes.STRING(100),
      ngay_batdau: DataTypes.DATEONLY,
      ngay_ketthuc: DataTypes.DATEONLY,
      ngay_tao: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}
    },
    {
      sequelize,
      modelName: 'HocKy',
      tableName: 'HocKy',
      timestamps: false,
      paranoid: true,
    }
  );

  return HocKy;
};
