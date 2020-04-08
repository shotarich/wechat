const path = require('path')

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
        const tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))

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