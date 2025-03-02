const express = require("express");
const router = express.Router();
const picdataController = require("../controllers/picdataController");
const { isAuth } = require("../utils/auth");
const handleErrorAsync = require("../utils/handleErrorAsync");

// 新增圖鑑
router.post(
  "/",
  isAuth,
  handleErrorAsync(picdataController.createPicData)
  /* 	
    #swagger.tags = ['PicData']
    #swagger.description = '新增圖鑑資料' 

    #swagger.parameters['picdata'] = {
      in: 'body',
      required: true,
      schema: {
        role: {
          type: 'string',
          description: '角色',
          required: true
        },
        name: {
          type: 'string',
          description: '名稱',
          required: true
        },
        nickname: {
          type: 'string',
          description: '社群常見暱稱',
          required: false
        },
        category: {
          type: 'string',
          description: '分類',
          required: true
        },
        series: {
          type: 'string',
          description: '系列',
          required: true
        },
        isShow: {
          type: 'number',
          description: '顯示狀態 (0: 隱藏, 1: 顯示)',
          default: 1
        },
        images: {
          type: 'array',
          description: '圖片列表',
          required: true,
          items: {
            type: 'object',
            properties: {
              sort: {
                type: 'number',
                description: '排序',
                required: true
              },
              type: {
                type: 'number',
                description: '類型 (1: 正版, 2: 盜版, 3: 正盜版比對)',
                required: true
              },
              url: {
                type: 'string',
                description: '圖片網址',
                required: true
              },
              desc: {
                type: 'string',
                description: '描述'
              },
              source: {
                type: 'string',
                description: '提供者'
              }
            }
          }
        }
      }
    }
  */
);

// 取得所有圖鑑資料
router.get(
  "/",
  handleErrorAsync(picdataController.getAllPicData)
  /* 	
    #swagger.tags = ['PicData']
    #swagger.description = '取得所有圖鑑資料' 

    #swagger.parameters['role'] = { 
      in: 'query', 
      description: '角色篩選 (all_chiikawa: 全部, chiikawa: 奇卡瓦, hachiware: 哈姬, usagi: 兔子...)', 
      type: 'string' 
    }
    #swagger.parameters['series'] = { 
      in: 'query', 
      description: '系列篩選 (all: 全部, soft_plush: 絨毛玩偶, cafe: 咖啡廳...)', 
      type: 'string' 
    }
    #swagger.parameters['category'] = { 
      in: 'query', 
      description: '分類篩選 (all: 全部, plush: 玩偶, keychain: 鑰匙圈...)', 
      type: 'string' 
    }
    #swagger.parameters['isShow'] = { 
      in: 'query', 
      description: '顯示狀態篩選 (all: 全部, 0: 隱藏, 1: 顯示)', 
      type: 'string' 
    }
    #swagger.parameters['keyword'] = { 
      in: 'query', 
      description: '關鍵字搜尋（搜尋名稱和暱稱）', 
      type: 'string' 
    }
  */
);

// 編輯圖鑑
router.put(
  "/:id",
  isAuth,
  handleErrorAsync(picdataController.editPicData)
  /* 	
    #swagger.tags = ['PicData']
    #swagger.description = '編輯圖鑑資料' 

    #swagger.parameters['picdata'] = {
      in: 'body',
      required: true,
      schema: {
        role: {
          type: 'string',
          description: '角色',
          required: true
        },
        name: {
          type: 'string',
          description: '名稱',
          required: true
        },
        nickname: {
          type: 'string',
          description: '社群常見暱稱',
          required: false
        },
        category: {
          type: 'string',
          description: '分類',
          required: true
        },
        series: {
          type: 'string',
          description: '系列',
          required: true
        },
        isShow: {
          type: 'number',
          description: '顯示狀態 (0: 隱藏, 1: 顯示)',
          default: 1
        },
        images: {
          type: 'array',
          description: '圖片列表',
          required: true,
          items: {
            type: 'object',
            properties: {
              sort: {
                type: 'number',
                description: '排序',
                required: true
              },
              type: {
                type: 'number',
                description: '類型 (1: 正版, 2: 盜版, 3: 正盜版比對)',
                required: true
              },
              url: {
                type: 'string',
                description: '圖片網址',
                required: true
              },
              desc: {
                type: 'string',
                description: '描述'
              },
              source: {
                type: 'string',
                description: '提供者'
              }
            }
          }
        }
      }
    }
  */
);

// 刪除圖鑑
router.delete(
  "/:id",
  isAuth,
  handleErrorAsync(picdataController.deletePicData)
  /* 	
    #swagger.tags = ['PicData']
    #swagger.description = '刪除圖鑑資料' 
  */
);

module.exports = router;
