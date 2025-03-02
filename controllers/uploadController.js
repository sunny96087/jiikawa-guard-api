// controllers / uploadController.js

const express = require("express");
const firebaseAdmin = require("../connection/firebase");
const { v4: uuidv4 } = require("uuid");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const appError = require("../utils/appError");
const handleSuccess = require("../utils/handleSuccess");

const bucket = firebaseAdmin.storage().bucket();

const tinify = require("tinify");
tinify.key = process.env.TINYPNG_API_KEY;

// 創建 S3 客戶端
const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "jiikawa";
// 使用自定義域名
const PUBLIC_BUCKET_URL = "https://r2.2fishs.com";

const uploadController = {
  // 上傳圖片
  uploadImage: async function (req, res, next) {
    const file = req.file;

    if (!file || file === "") {
      return next(appError(400, "請上傳圖片"));
    }

    // 上傳圖片到 TinyPNG 並壓縮
    const resultData = await new Promise((resolve, reject) => {
      tinify.fromBuffer(file.buffer).toBuffer(function (err, resultData) {
        if (err) reject(err);
        resolve(resultData);
      });
    });

    // 生成唯一的文件名
    const fileName = `images/${uuidv4()}.${file.originalname.split(".").pop()}`;

    // 上傳壓縮後的圖片到 R2
    await S3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: resultData,
        ContentType: file.mimetype,
      })
    );

    // 使用自定義域名生成 URL
    const url = `${PUBLIC_BUCKET_URL}/${fileName}`;

    handleSuccess(res, { imgUrl: url }, "上傳成功 回傳圖片網址");

    // 上傳檔案的地方:
    // 1. 加資料夾名稱 bucket.file(`image/${file.originalname}`)
    // 2. 直接存在最外層 bucket.file(file.originalname)
    // 3. 使用 UUID 產生檔案名稱
    // const blob = bucket.file(
    //   `images/${uuidv4()}.${file.originalname.split(".").pop()}`
    // );
    // const blobStream = blob.createWriteStream();

    // blobStream.on("finish", async () => {
    //   // 設定檔案的存取權限
    //   const config = {
    //     action: "read", // 權限
    //     expires: "12-31-2500", // 必填！ 網址的有效期限
    //   };

    //   // 取得檔案的網址
    //   const imgUrl = await new Promise((resolve, reject) => {
    //     blob.getSignedUrl(config, (err, imgUrl) => {
    //       if (err) reject(err);
    //       resolve(imgUrl);
    //     });
    //   });

    //   let data = {
    //     imgUrl,
    //   };
    //   handleSuccess(res, data, "上傳成功 回傳圖片網址");
    // });

    // blobStream.on("error", (err) => {
    //   //    res.status(500).send("上傳失敗");
    //   return next(appError(500, "上傳失敗，系統錯誤！"));
    // });

    // blobStream.end(resultData);
  },

  // 上傳圖片 -> 要登入才能用的版本
  // uploadUserImage: async function (req, res, next) {
  //   const file = req.file;

  //   if (!file || file === "") {
  //     return next(appError(400, "請上傳圖片"));
  //   }

  //   // 上傳圖片到 TinyPNG 並壓縮
  //   const resultData = await new Promise((resolve, reject) => {
  //     tinify.fromBuffer(file.buffer).toBuffer(function (err, resultData) {
  //       if (err) reject(err);
  //       resolve(resultData);
  //     });
  //   });

  //   // 上傳檔案的地方:
  //   // 1. 加資料夾名稱 bucket.file(`image/${file.originalname}`)
  //   // 2. 直接存在最外層 bucket.file(file.originalname)
  //   // 3. 使用 UUID 產生檔案名稱
  //   const blob = bucket.file(
  //     `images/${uuidv4()}.${file.originalname.split(".").pop()}`
  //   );
  //   const blobStream = blob.createWriteStream();

  //   blobStream.on("finish", async () => {
  //     // 設定檔案的存取權限
  //     const config = {
  //       action: "read", // 權限
  //       expires: "12-31-2500", // 必填！ 網址的有效期限
  //     };

  //     // 取得檔案的網址
  //     const imgUrl = await new Promise((resolve, reject) => {
  //       blob.getSignedUrl(config, (err, imgUrl) => {
  //         if (err) reject(err);
  //         resolve(imgUrl);
  //       });
  //     });

  //     let data = {
  //       imgUrl,
  //     };
  //     handleSuccess(res, data, "上傳成功 回傳圖片網址");
  //     // res.send({
  //     //   imgUrl,
  //     // });
  //   });

  //   blobStream.on("error", (err) => {
  //     //    res.status(500).send("上傳失敗");
  //     return next(appError(500, "上傳失敗，系統錯誤！"));
  //   });

  //   blobStream.end(resultData);
  // },

  // 刪除圖片
  deleteImage: async function (req, res, next) {
    // 取得檔案名稱 => ?fileName=test.jpeg 如果有資料夾名稱也要一起
    const fileName = req.query.fileName;

    await S3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
      })
    );

    handleSuccess(res, null, "刪除成功");

    // 取得檔案
    // const blob = bucket.file(fileName);
    // 刪除檔案
    // await blob.delete();
    // 刪除成功
    // handleSuccess(res, null, "刪除成功");
    // res.send("刪除成功");
  },

  // 獲取所有圖片列表
  getImages: async (req, res, next) => {
    const data = await S3.send(
      new ListObjectsCommand({
        Bucket: BUCKET_NAME,
      })
    );

    const fileList = (data.Contents || []).map((object) => ({
      fileName: object.Key,
      // 使用自定義域名生成 URL
      imgUrl: `${PUBLIC_BUCKET_URL}/${object.Key}`,
      uploadedAt: object.LastModified,
      size: object.Size,
    }));

    handleSuccess(res, fileList, "取得所有圖片列表成功");
    // 取得檔案列表
    // const [files] = await bucket.getFiles();
    // const fileList = [];
    // for (const file of files) {
    //   // 取得檔案的簽署 URL
    //   const fileUrl = await file.getSignedUrl({
    //     action: "read",
    //     expires: "03-09-2491",
    //   });
    //   fileList.push({
    //     fileName: file.name,
    //     imgUrl: fileUrl,
    //   });
    // }
    // handleSuccess(res, fileList, "取得所有圖片列表成功");
  },
};

module.exports = uploadController;
