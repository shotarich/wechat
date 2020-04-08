const Koa = require('koa')
const Wechat = require('./wechat/Wechat')
const AuotReply = require('./wechat/AutoReply')
const replyConfs = require('./wechat/replyConfig')
const parseWechatReq = require('./libs/parseWechatReq')
const validWechatAccess = require('./libs/validWechatAccess')

const app = new Koa()

app.use(validWechatAccess)

app.use(async (ctx, next) => {
  if(ctx.method.toLowerCase() !== 'post') return

  await next()

  const wechat = new Wechat()
  const autoReply = new AuotReply(ctx, next)

  const replies = replyConfs(wechat)
  replies.text.forEach(item => {
    autoReply.addMsgReply(item.msg, item.reply)
  })
  replies.event.forEach(item => {
    autoReply.addEventReply(item.name, item.reply)
  })
  autoReply.reply()
})

app.use(parseWechatReq)

app.listen(8000)