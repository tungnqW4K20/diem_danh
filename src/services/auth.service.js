const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');
const db = require('../models');
const TaiKhoan = db.TaiKhoan;
const GiangVien = db.GiangVien;
const Admin = db.Admin;
const CartItem = db.CartItem;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const registerGiangVien = async (data) => {
  const {
    username,
    password,
    ma_gv,
    ho,
    ten,
    email,
    sdt
  } = data;

  // --- Validate ---
  if (!username || !password || !ho || !ten) {
    throw new Error('Thiếu thông tin bắt buộc: username, password, ho, ten.');
  }

  // --- Check username trùng ---
  const existed = await TaiKhoan.findOne({ where: { username } });
  if (existed) {
    throw new Error('Username đã tồn tại.');
  }

  // --- Tạo giảng viên trước ---
  const giangvien = await GiangVien.create({
    ma_gv,
    ho,
    ten,
    email,
    sdt
  });

  // --- Hash mật khẩu ---
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // --- Tạo tài khoản liên kết giảng viên ---
  const account = await TaiKhoan.create({
    username,
    password_hash,
    vaitro: 'giangvien',
    lienket_loai: 'giangvien',
    lienket_id: giangvien.giangvien_id,
    trangthai: 'active'
  });

  const result = account.toJSON();
  delete result.password_hash;

  return {
    success: true,
    message: 'Tạo tài khoản giảng viên thành công',
    account: result,
    giangvien
  };
};

const loginCustomer = async (loginData) => {
    const { emailOrUsername, password } = loginData;

    if (!emailOrUsername || !password) {
        throw new Error('Vui lòng nhập email/username và mật khẩu.');
    }

    const customer = await Customer.findOne({
        where: {
            [db.Sequelize.Op.or]: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        }
    });

    if (!customer) {
        throw new Error('Email/username hoặc mật khẩu không chính xác.');
    }

    // So sánh mật khẩu trực tiếp (plaintext so với plaintext trong DB)
    if (password !== customer.password) {
        throw new Error('Email/username hoặc mật khẩu không chính xác.');
    }

    const payload = {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        role: "customer"
    };

    const token = generateToken(payload, 'customer');
    const refreshToken = generateRefreshToken(payload, 'customer' )
    const { password: _, ...customerInfo } = customer.toJSON();
    const cartCount = await CartItem.sum('quantity', {
        where: { customer_id: customer.id }
    });

    return { token, refreshToken, customer: customerInfo,  cartCount: cartCount || 0 };
};
const loginTaiKhoan = async ({ username, password }) => {
  // 1. Tìm tài khoản
 const account = await TaiKhoan.findOne({
  where: { username },
  include: [
    {
      model: db.GiangVien,
      as: "GiangVien", // 🔥 BẮT BUỘC
      attributes: ["giangvien_id", "ma_gv", "ho", "ten"]
    }
  ]
});

  if (!account) {
    throw new Error('Username hoặc mật khẩu không chính xác.');
  }

  // 2. Check trạng thái tài khoản
//   if (account.trangthai !== 'active') {
//     throw new Error('Tài khoản đang bị khóa hoặc chưa kích hoạt.');
//   }

  // 3. So sánh mật khẩu hash
  const isMatch = await bcrypt.compare(password, account.password_hash);
  if (!isMatch) {
    throw new Error('Username hoặc mật khẩu không chính xác.');
  }

  // 4. Tạo token
  const token = generateToken(account);

  // 5. Xoá password trước khi trả về
  const data = account.toJSON();
  delete data.password_hash;

  return {
    token,
     user: {
    ...data,
    giangvien_id: data.GiangVien?.giangvien_id 
  }
  };
};
const loginAdmin = async (loginData) => {
    const { username, password } = loginData;

    if (!username || !password) {
        throw new Error('Vui lòng nhập email/username và mật khẩu.');
    }
    console.log("username", username)
    console.log("password", password)
    console.log("db", db)
    console.log("Admin", Admin)

    const admin = await Admin.findOne({
        where: {
            [db.Sequelize.Op.or]: [ { username: username }]
        }
    });
    console.log("admin", admin)
    if (!admin) {
        throw new Error('Không tìm thấy admin');
    }

    const isPasswordMatch = password === admin.password;

    if (!isPasswordMatch) {
        throw new Error('Email/username hoặc mật khẩu không chính xác.');
    }

    const payload = {
        id: admin.id,
        username: admin.username,
        role: "admin"
    };

    const token = generateToken(payload, 'admin');
    const refreshToken = generateRefreshToken(payload, 'admin' )

    const { password: _, ...adminInfo } = admin.toJSON();
    return { token, refreshToken, admin: adminInfo };
};

const newRefreshToken = async () => {
    try {
        const decoded = verifyRefreshToken(token);
        const {iat, exp, ...payload} = decoded
        
        const newAccessToken = generateToken(payload, payload.role)
        const newRefreshToken = generateRefreshToken(payload, payload.role)

        return {
            accessToken : newAccessToken,
            refreshToken: newRefreshToken,
            user: payload
        }
    } catch (error) {
        
    }
}

const generateNewTokens = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken)
    const { iat, exp, ...payload } = decoded

    const newAccessToken = generateToken(payload, payload.role)
    const newRefreshToken = generateRefreshToken(payload, payload.role)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: payload
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
    registerGiangVien,
    loginCustomer,
    loginAdmin,
    newRefreshToken,
    generateNewTokens,
    loginTaiKhoan
};