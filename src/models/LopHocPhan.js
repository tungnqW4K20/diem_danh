'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LopHocPhan extends Model {
    static associate(models) {
      LopHocPhan.belongsTo(models.MonHoc, { foreignKey: 'monhoc_id' });
      LopHocPhan.belongsTo(models.GiangVien, { foreignKey: 'giangvien_id' });
      LopHocPhan.belongsTo(models.HocKy, { foreignKey: 'hocky_id' });

      // Quan hệ N-N với LopHanhChinh qua bảng trung gian
      LopHocPhan.belongsToMany(models.LopHanhChinh, {
        through: models.LHP_LHC,
        foreignKey: 'lophocphan_id',
        otherKey: 'lop_hanhchinh_id',
        as: 'DanhSachLopHanhChinh'
      });

      // Buổi học & đăng ký
      LopHocPhan.hasMany(models.BuoiHoc, {
        foreignKey: 'lophocphan_id',
        as: 'DanhSachBuoiHoc'
      });

      LopHocPhan.hasMany(models.DangKyHoc, {
        foreignKey: 'lophocphan_id',
        as: 'DangKy'
      });
      LopHocPhan.belongsTo(models.CoSo, {
        foreignKey: 'coso_id',
        as: 'CoSo'
      });
    }
  }



  LopHocPhan.init(
    {
      lophocphan_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      ten_lophocphan : {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      monhoc_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      giangvien_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      hocky_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      phong: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      thu: {
        type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
        allowNull: false
      },
      gio_batdau: {
        type: DataTypes.TIME,
        allowNull: false
      },
      gio_ketthuc: {
        type: DataTypes.TIME,
        allowNull: false
      },
      ngay_tao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      coso_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'CoSo', key: 'coso_id' }
      },
    },
    {
      sequelize,
      modelName: 'LopHocPhan',
      tableName: 'LopHocPhan',
      timestamps: false
    }
  );

  return LopHocPhan;
};
