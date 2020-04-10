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

        try {
          allTempMaterialInfos = JSON.parse(allTempMaterialInfos)
          tempMaterialInfos = allTempMaterialInfos.find(item => item.msg === '2') || {}
        }catch(e) {
          console.log('在catch里面上传的素材')
          tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
          tempMaterialInfos.msg = '2'
        }
        
        if(!isEnableTempMaterial(tempMaterialInfos)) {
          console.log('在isEnableTempMaterial里面上传的素材')
          tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
          tempMaterialInfos.msg = '2'

          await saveTempMaterial(tempMaterialInfos).catch(err => {
            console.log('缓存临时素材id出错')
            console.error(err)
          })
        }

        const reply = {
          msgType: 'image',
          content: {
            media_id: tempMaterialInfos.media_id
          }
        }
        
        console.log('生成2的回复是', reply)

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