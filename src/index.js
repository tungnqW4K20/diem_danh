require('dotenv').config();
const corsMiddleware = require('./config/cors.config');
const express = require('express');
const path = require('path');
const db = require('./models');

const app = express();
const port = process.env.PORT || 3001;

const host='192.168.0.116'


const authRoutes = require('./routes/auth.routes');

const GiangVienRoutes = require('./routes/giangvien.routes');
const LopRoutes = require('./routes/lop.routes');
const QRRoutes = require('./routes/qr.routes');
const PhanCongRoutes = require('./routes/phancong.routes')


app.use(corsMiddleware);
app.use(express.json()); 

db.sequelize.authenticate()
  .then(() => {
    console.log(' Kết nối MySQL thành công!');
    //return db.sequelize.sync(); 
    return db.sequelize.sync({ alter: true }); // thay đổi cấu trúc bảng
  })


  .then(() => {
    console.log('✅ Đồng bộ bảng thành công!');
    app.use('/api/auth', authRoutes);
    app.use('/api/giang-vien', GiangVienRoutes);
    app.use('/api/lop', LopRoutes);
    app.use('/api/qr', QRRoutes);
    app.use('/api/phan-cong', PhanCongRoutes);
    


    app.listen(port,host, () => {
      console.log(` Server chạy tại http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error(' Lỗi khởi tạo:', err);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).send('Có lỗi xảy ra!');
});



