const replyConfFn = require('./replyConfig')
const path = require('path')

module.exports = {
  genReply: async (ctx, next) => {
    const formatedMsg = ctx.formatedMsg
    const { MsgType, Event, Content } = formatedMsg

    // const replyConf = replyConfFn()
    // const main = replyConf[MsgType]
    // const reply = Array.isArray(main)
    //   ? (main.find(item => item.content === Content) || main[0])['reply']
    //   : main[Event]
    if(MsgType === 'text' && Content.toString() === '3') {
      const filePath = path.join(__dirname, '../files/image/1.png')
      ctx.wechat.uploadTempMaterial('image', filePath).then(data =>{
        ctx.body = {
          msgType: 'image',
          content: {
            img_id: data.media_id
          }
        }
      })
    }

    // ctx.body = typeof reply === 'function' ? reply() : ''

    await next()
  }
}