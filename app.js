const Koa = require('koa')
// const Menu = require('./wechat/menu/Menu')
const AuotReply = require('./wechat/reply/Reply')
const replyConfs = require('./wechat/reply/replyConf')
const parseWechatReq = require('./libs/parseWechatReq')
const validWechatAccess = require('./libs/validWechatAccess')

const app = new Koa()
const autoReply = new AuotReply()
// const menu = new Menu()

const replies = replyConfs()
replies.text.forEach(item => {
  autoReply.addMsgReply(item.msg, item.reply)
})
replies.event.forEach(item => {
  autoReply.addEventReply(item.name, item.reply)
})

app.use(validWechatAccess)
app.use(async (ctx, next) => {
  if(ctx.method.toLowerCase() !== 'post') return

  await next()
  await autoReply.reply(ctx)
})

app.use(parseWechatReq)

app.listen(8000)