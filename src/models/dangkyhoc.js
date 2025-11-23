'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DangKyHoc extends Model {
    static associate(models) {
      DangKyHoc.belongsTo(models.SinhVien, { foreignKey: 'sinhvien_id' });
      DangKyHoc.belongsTo(models.Lop, { foreignKey: 'lop_id' });
    }
  }
  DangKyHoc.init({
    dangky_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    sinhvien_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'SinhVien', key: 'sinhvien_id' },
      onDelete: 'CASCADE'
    },
    lop_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Lop', key: 'lop_id' },
      onDelete: 'CASCADE'
    },
    ngay_dangky: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    trangthai: {
      type: DataTypes.ENUM('active', 'left', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'DangKyHoc',
    tableName: 'DangKyHoc',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['sinhvien_id', 'lop_id']
      }
    ]
  });
  return DangKyHoc;
};