'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LopHocPhan extends Model {
    static associate(models) {
      LopHocPhan.belongsTo(models.MonHoc, { foreignKey: 'monhoc_id' });
      LopHocPhan.belongsTo(models.GiangVien, { foreignKey: 'giangvien_id' });
      LopHocPhan.belongsTo(models.HocKy, { foreignKey: 'hocky_id' });
LopHocPhan.belongsTo(models.LopHanhChinh, {
  foreignKey: 'lop_hanhchinh_id',
  as: 'LopHanhChinh'
});
      LopHocPhan.hasMany(models.DangKyHoc, {
        foreignKey: 'lophocphan_id',
        as: 'DangKy'
      });

      LopHocPhan.hasMany(models.BuoiHoc, {
        foreignKey: 'lophocphan_id',
        as: 'DanhSachBuoiHoc'
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
      monhoc_id: DataTypes.UUID,
      giangvien_id: DataTypes.UUID,
      hocky_id: DataTypes.UUID,
      lop_id: DataTypes.UUID,
      phong: DataTypes.STRING(200),
      thu: {
        type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
      },
      gio_batdau: DataTypes.TIME,
      gio_ketthuc: DataTypes.TIME,
      ngay_tao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
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
