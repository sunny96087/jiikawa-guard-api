const handleSuccess = require("../utils/handleSuccess");

const robotController = {
  // 檢查伺服器存活狀態 (API 端點使用)
  checkAlive: async function (req, res, next) {
    handleSuccess(res, null, "Server is alive");
  },
  
  // 內部檢查伺服器存活狀態 (定時任務使用)
  checkAliveInternal: async function () {
    return "Server is alive";
  }
};

module.exports = robotController; 