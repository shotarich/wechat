const Koa = require('koa')
const Wechat = require('./wechat/Wechat')
const AuotReply = require('./wechat/AutoReply')
const replyConfs = require('./wechat/replyConfig')
const parseWechatReq = require('./libs/parseWechatReq')
const validWechatAccess = require('./libs/validWechatAccess')

const { genReplyXml } = require('./util')

const app = new Koa()
const wechat = new Wechat()

app.use(validWechatAccess)
app.use(async (ctx, next) => {
  if(ctx.method.toLowerCase() !== 'post') return

  await next()

  const wechatBody = ctx.wechatBody
  if(wechatBody.MsgType === 'text' && wechatBody.Content === '2') {
    const temp = await wechat.uploadTempMaterial('image', './files/image/1.png')

    const content = {
      media_id: temp.media_id
    }
    const xml = genReplyXml('image', content, wechatBody)

    ctx.body = xml
    ctx.type = 'application/xml'
    ctx.status = 200
  }
  // const autoReply = new AuotReply(ctx, next)

  // const replies = replyConfs(wechat)
  // replies.text.forEach(item => {
  //   autoReply.addMsgReply(item.msg, item.reply)
  // })
  // replies.event.forEach(item => {
  //   autoReply.addEventReply(item.name, item.reply)
  // })
  // autoReply.reply()
})

app.use(parseWechatReq)

app.listen(8000)