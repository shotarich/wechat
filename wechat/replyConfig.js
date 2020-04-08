const path = require('path')

module.exports = wechat => ({
  text: [
    {
      msg: '1',
      reply: new Promise(resolve => {
        const reply = {
          msgType: 'text',
          content: {
            text: '你说1是啥意思?'
          }
        }
    
        resolve(reply)
      })
    },
    {
      msg: '2',
      reply: (async () => {
        const tempMaterialInfos = await wechat.uploadTempMaterial('image', path.join(__dirname, '../files/image/1.png'))

        const reply = {
          msgType: 'image',
          content: {
            media_id: tempMaterialInfos.media_id
          }
        }

        console.log(reply)

        return Promise.resolve(reply)
      })()
    }
  ],
  event: [
    {
      name: 'subscribe',
      reply: new Promise(resolve => {
        const reply = {
          msgType: 'text',
          content: {
            text: '欢迎关注老衲的公众号!'
          }
        }
    
        resolve(reply)
      })
    }
  ]
})