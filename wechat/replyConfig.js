const fs = require('fs')
const path = require('path')
const { temp_material_file_path } = require('../constants/wechat')
const { isEnableTempMaterial, saveTempMaterial } = require('../util')

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
        let tempMaterialInfos = await fs.promises.readFile(temp_material_file_path, 'utf8').catch(err => {
          console.log('获取临时素材信息出错, 对应的消息内容是2')
          console.error(err)
        })

        if(tempMaterialInfos && typeof tempMaterialInfos === 'string') {
          try {
            tempMaterialInfos = JSON.parse(tempMaterialInfos)
          }catch(e) {
            tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
          }

          if(!isEnableTempMaterial(tempMaterialInfos)) {
            tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
            tempMaterialInfos.expires_in = Date.now()

            saveTempMaterial(tempMaterialInfos)
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