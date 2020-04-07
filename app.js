const Koa = require('koa')
const getRawBody = require('raw-body')
const { xml2Json } = require('./util')
const weixin = require('./wechat/weixin')
const isWechatReq = require('./libs/checkWechat')

const app = new Koa()
app.use(isWechatReq())
app.use(async (ctx, next) => {
  const method = ctx.method.toLowerCase()
  if(method !== 'post') return

  const data = await getRawBody(ctx.req, {
    length: ctx.length,
    limit: '1mb',
    encoding: this.charset
  }).catch(err => {
    console.error(err)
  })

  const wechat = ctx.wechat
  const formatedMsg = xml2Json(data)
  ctx.formatedMsg = formatedMsg

  await weixin.genReply(ctx, next)
  wechat.reply(ctx)
})

app.listen(80)