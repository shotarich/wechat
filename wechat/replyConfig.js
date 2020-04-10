const fs = require('fs')
const path = require('path')
const { isEnableTempMaterial, saveTempMaterial, getTempMaterial } = require('../util')

module.exports = wechat => ({
  text: [
    {
      msg: '1',
      reply: () => ({
        msgType: 'text',
        content: {
          text: '你说1是啥意思?'
        }
      })
    },
    {
      msg: '2',
      reply: async () => {
        let allTempMaterialInfos = await getTempMaterial().catch(err => {
          console.log('获取临时素材信息出错, 对应的消息内容是2')
          console.error(err)
        })
        let tempMaterialInfos = null

        if(allTempMaterialInfos && typeof allTempMaterialInfos === 'string') {
          try {
            allTempMaterialInfos = JSON.parse(allTempMaterialInfos)
            tempMaterialInfos = allTempMaterialInfos.find(item => item.msg === '2') || {}
          }catch(e) {
            tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
          }

          if(!isEnableTempMaterial(tempMaterialInfos)) {
            tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
            tempMaterialInfos.expires_in = Date.now() + 3600 * 1000 * 24 * 3
            tempMaterialInfos.msg = '2'

            await saveTempMaterial(tempMaterialInfos).catch(err => {
              console.log('缓存临时素材id出错')
              console.error(err)
            })
          }
        }

        const reply = {
          msgType: 'image',
          content: {
            media_id: tempMaterialInfos.media_id
          }
        }

        return Promise.resolve(reply)
      }
    }
  ],
  event: [
    {
      name: 'subscribe',
      reply: () => ({
        msgType: 'text',
        content: {
          text: '欢迎关注老衲的公众号!'
        }
      })
    }
  ]
})