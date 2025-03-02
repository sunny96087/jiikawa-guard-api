const mongoose = require("mongoose");

const picDataSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "角色未填寫"],
      // enum: ["chiikawa", "hachiware", "usagi", "momochi"], // 根據你的角色列表調整
    },
    name: {
      type: String,
      required: [true, "名稱未填寫"],
    },
    nickname: {
      type: String,
      // default: "2魚", // 社群常見暱稱,可選
    },
    category: {
      type: String,
      required: [true, "分類未填寫"],
      // enum: ["plush", "keychain", "others"], // 根據你的分類列表調整
    },
    series: {
      type: String,
      required: [true, "系列未填寫"],
      // enum: ["soft_plush", "cafe", "yomiuri_giants", "others"], // 根據你的系列列表調整
    },
    isShow: {
      type: Number,
      enum: [0, 1], // 0: 隱藏, 1: 顯示
      default: 1,
    },
    images: [
      {
        sort: {
          type: Number,
          // required: true,
        },
        type: {
          type: Number,
          enum: [1, 2, 3], // 1: 正版 2: 盜版 3: 正盜版比對
          // required: true,
        },
        url: {
          type: String,
          // required: true,
        },
        desc: String,
        source: String,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PicData = mongoose.model("PicData", picDataSchema);

module.exports = PicData;
