'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhanCongMon extends Model {
    static associate(models) {
      PhanCongMon.belongsTo(models.MonHoc, { foreignKey: 'monhoc_id' });
      PhanCongMon.belongsTo(models.Lop, { foreignKey: 'lop_id' });
      PhanCongMon.belongsTo(models.GiangVien, { foreignKey: 'giangvien_id' });
      PhanCongMon.belongsTo(models.HocKy, { foreignKey: 'hocky_id' });
      PhanCongMon.hasMany(models.BuoiDiemDanh, { foreignKey: 'phancong_id' });
    }
  }
  PhanCongMon.init({
    phancong_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    monhoc_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'MonHoc', key: 'monhoc_id' },
      onDelete: 'CASCADE'
    },
    lop_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Lop', key: 'lop_id' },
      onDelete: 'CASCADE'
    },
    giangvien_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'GiangVien', key: 'giangvien_id' },
      onDelete: 'CASCADE'
    },
    hocky_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'HocKy', key: 'hocky_id' },
      onDelete: 'CASCADE'
    },
    thu: {
      type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
      allowNull: false
    },
    gio_batdau: DataTypes.TIME,
    gio_ketthuc: DataTypes.TIME,
    phong: DataTypes.STRING(200),
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PhanCongMon',
    tableName: 'PhanCongMon',
    timestamps: false
  });
  return PhanCongMon;
};
