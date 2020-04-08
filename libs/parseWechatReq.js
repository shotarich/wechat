const getRawBody = require('raw-body')
const { xml2Json } = require('../util')

exports = module.exports = async (ctx, next) => {
  const data = await getRawBody(ctx.req, {
    length: ctx.length,
    limit: '1mb'
  }).catch(err => {
    console.info('获取微信请求body出错')
    console.error(err)
  })
  
  ctx.wechatMsg = xml2Json(data)
  await next()
}