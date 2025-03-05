const PicData = require("../models/picdata");
const handleSuccess = require("../utils/handleSuccess");
const appError = require("../utils/appError");
const dayjs = require("dayjs");

const picdataController = {
  // 新增圖鑑
  createPicData: async function (req, res, next) {
    const { role, name, nickname, category, series, isShow, images } = req.body;

    // 檢查必填欄位
    if (!role || !name || !category || !series) {
      return next(appError(400, "角色、名稱、分類和系列為必填項"));
    }

    // 檢查圖片資料
    // if (!images || !Array.isArray(images) || images.length === 0) {
    //   return next(appError(400, "至少需要一張圖片"));
    // }

    // 檢查每張圖片的必填欄位
    // for (const image of images) {
    //   if (!image.sort || !image.type || !image.url) {
    //     return next(appError(400, "圖片的排序、類型和URL為必填項"));
    //   }
    // }

    // 將 isShow 轉換為數字
    const isShowNumber = Number(isShow);

    // 儲存到資料庫
    const picdata = await PicData.create({
      role,
      name,
      nickname,
      category,
      series,
      isShow: isShowNumber,
      images,
    });

    handleSuccess(res, picdata, "新增圖鑑成功");
  },

  // 取得所有圖鑑資料
  getAllPicData: async function (req, res, next) {
    // 從請求中獲取參數
    const {
      role,
      series,
      category,
      isShow,
      keyword,
      page = 1,
      limit = 10,
    } = req.query;

    // 初始化查詢對象
    let query = {};

    // 根據角色過濾
    if (role) {
      if (role === "all") {
        query.role = {
          $in: [
            "chiikawa",
            "hachiware",
            "usagi",
            "momonga",
            "kurimanjuu",
            "rakko",
            "shisa",
            "kani",
            "ano_ko",
            "daistrong",
            "sou",
            "chimera",
            "yoroisan",
            "kabutomushi",
            "yousei",
            "hoshi",
            "others_chiikawa",
            "polar_bear",
            "croquette",
            "sausage",
            "pug",
            "others_nagano",
          ],
        };
      } else if (role === "all_chiikawa") {
        query.role = {
          $in: [
            "chiikawa",
            "hachiware",
            "usagi",
            "momonga",
            "kurimanjuu",
            "rakko",
            "shisa",
            "kani",
            "ano_ko",
            "daistrong",
            "sou",
            "chimera",
            "yoroisan",
            "kabutomushi",
            "yousei",
            "hoshi",
            "others_chiikawa",
          ],
        };
      } else if (role === "all_nagano") {
        query.role = {
          $in: ["polar_bear", "croquette", "sausage", "pug", "others_nagano"],
        };
      } else {
        query.role = role;
      }
    }

    // 根據系列過濾
    if (series && series !== "all") {
      query.series = series;
    }

    // 根據分類過濾
    if (category && category !== "all") {
      query.category = category;
    }

    // 根據顯示狀態過濾
    if (isShow && isShow !== "all") {
      query.isShow = isShow;
    }

    // 根據關鍵字過濾
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { nickname: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
        { series: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }

    // 從新到舊排序
    const sortOption = { createdAt: -1 };

    // 計算總筆數
    const total = await PicData.countDocuments(query);

    // 計算總頁數
    const totalPages = Math.ceil(total / limit);

    // 計算要跳過的數量
    const skip = (page - 1) * limit;

    // 取得分頁後的資料
    const picDataList = await PicData.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // 格式化時間
    const formattedPicDataList = picDataList.map((picData) => {
      const picDataObj = picData.toObject();
      return {
        ...picDataObj,
        createdAt: dayjs(picDataObj.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: dayjs(picDataObj.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    // 回傳資料包含分頁資訊
    handleSuccess(
      res,
      {
        data: formattedPicDataList,
        pagination: {
          total, // 總筆數
          totalPages, // 總頁數
          currentPage: Number(page), // 當前頁數
          limit: Number(limit), // 每頁筆數
        },
      },
      "取得圖鑑資料成功"
    );
  },

  // 編輯圖鑑
  editPicData: async function (req, res, next) {
    const picDataId = req.params.id;
    const { role, name, nickname, category, series, isShow, images } = req.body;

    // 檢查必填欄位
    if (!role || !name || !category || !series) {
      return next(appError(400, "角色、名稱、分類和系列為必填項"));
    }

    // 檢查圖片資料
    // if (!images || !Array.isArray(images) || images.length === 0) {
    //   return next(appError(400, "至少需要一張圖片"));
    // }

    // 更新圖鑑
    const updatedPicData = await PicData.findByIdAndUpdate(
      picDataId,
      {
        role,
        name,
        nickname,
        category,
        series,
        isShow,
        images,
      },
      { new: true }
    );

    if (!updatedPicData) {
      return next(appError(404, "找不到該圖鑑"));
    }

    handleSuccess(res, updatedPicData, "編輯圖鑑成功");
  },

  // 刪除圖鑑
  deletePicData: async function (req, res, next) {
    const picDataId = req.params.id;

    const deletedPicData = await PicData.findByIdAndDelete(picDataId);

    if (!deletedPicData) {
      return next(appError(404, "找不到該圖鑑"));
    }

    handleSuccess(res, deletedPicData, "刪除圖鑑成功");
  },
};

module.exports = picdataController;
