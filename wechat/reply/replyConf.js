const path = require('path')
const Material = require('../Material')

module.exports = () => {
  const material = new Material()

  return {
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
          const filePath = path.join(__dirname, '../files/image/1.png')
          const tempMaterialInfos = await material.genTempMaterialInfos('2', 'image', filePath).catch(err => {
            console.log('生成素材详情失败')
            console.error(err)
          })

          const reply = {
            msgType: 'image',
            content: {
              media_id: tempMaterialInfos.media_id
            }
          }

          return reply
        }
      },
      {
        msg: '3',
        reply: async () => {
          const filePath = path.join(__dirname, '../files/vedio/1.mp4')
          const tempMaterialInfos = await material.genTempMaterialInfos('3', 'video', filePath).catch(err => {
            console.log('生成素材详情失败')
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

          return reply
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
  }
}