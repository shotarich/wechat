const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const util = require('./util')
const views =  require('koa-views')
const koaStatic = require('koa-static')
const Menu = require('./wechat/menu/Menu')
const AuotReply = require('./wechat/reply/Reply')
const parseWechatReq = require('./libs/parseWechatReq')
const validWechatAccess = require('./libs/validWechatAccess')

const app = new Koa()
const autoReply = new AuotReply()
const menu = new Menu()

const staticPath = path.join(__dirname, './views')
app.use(koaStatic(staticPath))

// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(async (ctx, next) => {
  if(ctx.originalUrl === '/wechat') {
    // await ctx.render('index')
    const imgs = await fs.promises.readdir('./views/imgs/')
    const list = imgs.map(item => {
      const [address, age] = item.split('.')[0].split('-')
      return {
        age,
        address,
        src: `/imgs/${item}`
      }
    })

    const renderData = {
      list,
      cssPath: util.genAbsolutePath(path.join(__dirname, 'style/css/main.min.css'))
    }
    await ctx.render('index', renderData)
    console.log(list)
  }else {
    await next()
  }
})

app.use(validWechatAccess)
app.use(async (ctx, next) => {
  if(ctx.method.toLowerCase() !== 'post') return

  await next()
  await autoReply.reply(ctx)
})

app.use(parseWechatReq)

app.listen(8000)