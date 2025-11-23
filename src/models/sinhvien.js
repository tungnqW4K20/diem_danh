'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SinhVien extends Model {
    static associate(models) {
      SinhVien.belongsTo(models.Lop, { foreignKey: 'lop_id' });
      SinhVien.hasMany(models.DangKyHoc, { foreignKey: 'sinhvien_id' });
      SinhVien.hasMany(models.ChiTietDiemDanh, { foreignKey: 'sinhvien_id' });
    }
  }
  SinhVien.init({
    sinhvien_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    ma_sv: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
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
    ngaysinh: {
      type: DataTypes.DATEONLY
    },
    lop_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Lop',
        key: 'lop_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'SinhVien',
    tableName: 'SinhVien',
    timestamps: false
  });
  return SinhVien;
};

