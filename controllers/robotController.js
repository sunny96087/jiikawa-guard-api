const handleSuccess = require("../utils/handleSuccess");

const robotController = {
  // 檢查機器人存活狀態
  checkAlive: async function (req, res, next) {
    handleSuccess(res, null, "Robot is alive");
  },
  
  // 未來可以在這裡添加其他機器人相關的功能
  // 例如：機器人狀態記錄、運行統計等
};

module.exports = robotController; 