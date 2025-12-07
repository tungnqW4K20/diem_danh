'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BuoiHoc extends Model {
    static associate(models) {
      // Buổi học thuộc về một lớp học phần
      BuoiHoc.belongsTo(models.LopHocPhan, {
        foreignKey: 'lophocphan_id',
        as: 'LopHocPhan'
      });

      // Buổi học được tạo bởi một tài khoản (giảng viên/admin)
      BuoiHoc.belongsTo(models.TaiKhoan, {
        foreignKey: 'nguoi_tao',
        as: 'NguoiTao'
      });

      // Một buổi học có nhiều bản ghi điểm danh
      BuoiHoc.hasMany(models.DiemDanh, {
        foreignKey: 'buoi_id',
        as: 'DanhSachDiemDanh'
      });
    }
  }

  BuoiHoc.init(
    {
      buoi_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      lophocphan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'LopHocPhan', key: 'lophocphan_id' },
        onDelete: 'CASCADE'
      },
      ngay: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      batdau: {
        type: DataTypes.DATE
      },
      ketthuc: {
        type: DataTypes.DATE
      },
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
    },
    {
      sequelize,
      modelName: 'BuoiHoc',   // 👈 Quan trọng: trùng với models.BuoiHoc
      tableName: 'BuoiHoc',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['lophocphan_id', 'ngay']
        }
      ]
    }
  );

  return BuoiHoc;
};
