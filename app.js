const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const util = require('./util')
const views =  require('koa-views')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const routerChildren = require('./routes')
const Menu = require('./wechat/menu/Menu')
const AuotReply = require('./wechat/reply/Reply')
const parseWechatReq = require('./libs/parseWechatReq')
const validWechatAccess = require('./libs/validWechatAccess')

const app = new Koa()
const router = new Router()
const autoReply = new AuotReply()
const menu = new Menu()

// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// 配置路由
router.use('/wechat', routerChildren.routes(), routerChildren.allowedMethods())
app.use(router.routes(), router.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

// 配置静态目录
const staticPath = path.join(__dirname, './views')
app.use(koaStatic(staticPath))

// 微信公众号解析
app.use(validWechatAccess)
app.use(async (ctx, next) => {
  if(ctx.method.toLowerCase() !== 'post') return

  await next()
  await autoReply.reply(ctx)
})

app.use(parseWechatReq)

app.listen(8000)