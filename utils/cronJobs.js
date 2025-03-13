// cronJobs.js
const cron = require("node-cron");
const User = require("../models/user"); // 根據您的專案結構調整路徑
const robotController = require("../controllers/robotController");

// 定義定時任務函數
const deleteExpiredAccounts = async () => {
  try {
    // 找到所有驗證鏈接已過期的帳號
    const expiredUsers = await User.find({
      emailVerificationTokenExpires: { $lt: Date.now() },
    });

    // 刪除所有驗證鏈接已過期的帳號
    await User.deleteMany({
      emailVerificationTokenExpires: { $lt: Date.now() },
    });

    // 回傳被刪除的用戶的 email 或者相應的訊息
    if (expiredUsers.length > 0) {
      const deletedEmails = expiredUsers.map((user) => user.email);
      console.log(
        `定時任務已完成，被刪除的用戶 email: ${deletedEmails.join(", ")}`
      );
      return `定時任務已完成，被刪除的用戶 email: ${deletedEmails.join(", ")}`;
    } else {
      console.log("定時任務已完成，沒有已過期的驗證帳號");
      return "定時任務已完成，沒有已過期的驗證帳號";
    }
  } catch (error) {
    console.error("刪除過期帳號時發生錯誤:", error);
    return "刪除過期帳號時發生錯誤";
  }
};

// 定義伺服器存活檢查函數
const checkRobotAlive = async () => {
  try {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] 執行伺服器存活檢查`);
    
    const message = await robotController.checkAliveInternal();
    console.log(`伺服器存活檢查完成: ${message}`);
    
    return "伺服器存活檢查完成";
  } catch (error) {
    console.error("伺服器存活檢查失敗:", error);
    return "伺服器存活檢查失敗";
  }
};

// 定時任務：每 1 小時執行一次
// cron.schedule("0 */1 * * *", () => {
//   deleteExpiredAccounts()
//     .then((message) => {
//       console.log(message);
//     })
//     .catch((error) => {
//       console.error("定時任務執行時發生錯誤:", error);
//     });
// });

// 立即執行一次定時任務 => 寫了會變成執行兩次
/**
    deleteExpiredAccounts().then(message => {
    console.log(message);
    }).catch(error => {
    console.error('立即執行的定時任務執行時發生錯誤:', error);
    });
 */

// 定時任務：每5分鐘執行一次機器人存活檢查
cron.schedule("*/1 * * * *", () => {
  checkRobotAlive()
    .then((message) => console.log("伺服器存活檢查完成", message))
    .catch((error) => console.error("伺服器存活檢查失敗:", error));
});

// 只導出 deleteExpiredAccounts 函數
module.exports = deleteExpiredAccounts;
