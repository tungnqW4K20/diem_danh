'use strict';
const phanCongService = require('../services/phancong.service');
const dayjs = require("dayjs");


const getLichGiangDay = async (req, res) => {
  try {
    const { giangvien_id, hocky_id } = req.query;

    if (!giangvien_id || !hocky_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp giangvien_id và hocky_id."
      });
    }

    const data = await phanCongService.getLichGiangDay(giangvien_id, hocky_id);

    return res.status(200).json({
      success: true,
      message: data.length === 0 
        ? "Không có lịch giảng dạy trong học kỳ này."
        : "Lấy lịch giảng dạy thành công.",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLichHomNay = async (req, res) => {
  try {
    const { giangvien_id } = req.query;
    if (!giangvien_id) {
      return res.status(400).json({ success: false, message: "Thiếu giangvien_id" });
    }

    const today = dayjs().format("YYYY-MM-DD");
    // Chỉ lấy hôm nay
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

    const data = await phanCongService.getLichTuanNay(giangvien_id, today, tomorrow);

    res.status(200).json({
      success: true,
      message: "Lấy lịch hôm nay thành công",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLichTuan = async (req, res) => {
  try {
    const { giangvien_id } = req.query;
    if (!giangvien_id) {
      return res.status(400).json({ success: false, message: "Thiếu giangvien_id" });
    }

    const today = dayjs().format("YYYY-MM-DD");
    const nextWeek = dayjs().add(7, "day").format("YYYY-MM-DD");

    const data = await phanCongService.getLichTuanNay(giangvien_id, today, nextWeek);

    
    res.status(200).json({
      success: true,
      message: "Lấy lịch tuần thành công",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getLichGiangDay,
  getLichHomNay,
  getLichTuan
};