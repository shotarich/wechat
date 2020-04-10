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
          tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))
          tempMaterialInfos.msg = '2'
        }
        
        if(!isEnableTempMaterial(tempMaterialInfos)) {
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
    },
    {
      msg: '3',
      reply: async () => {
        let allTempMaterialInfos = await getTempMaterial().catch(err => {
          console.log('获取临时素材信息出错, 对应的消息内容是3')
          console.error(err)
        })
        let tempMaterialInfos = null

        try {
          allTempMaterialInfos = JSON.parse(allTempMaterialInfos)
          tempMaterialInfos = allTempMaterialInfos.find(item => item.msg === '3') || {}
        }catch(e) {
          tempMaterialInfos = await wechat.uploadTempMaterial('video', path.join(__dirname, '../files/vedio/1.mp4'))
          tempMaterialInfos.msg = '3'
        }
        
        if(!isEnableTempMaterial(tempMaterialInfos)) {
          tempMaterialInfos = await wechat.uploadTempMaterial('video', path.join(__dirname, '../files/vedio/1.mp4'))
          tempMaterialInfos.msg = '3'
        }

        await saveTempMaterial(tempMaterialInfos).catch(err => {
          console.log('缓存临时素材id出错')
          console.error(err)
        })

        const reply = {
          msgType: 'video',
          content: {
            media_id: tempMaterialInfos.media_id,
            vedio_title: '测试',
            vedio_description: '视频描述'
          }
        }
        
        console.log('生成3的回复是', reply)

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