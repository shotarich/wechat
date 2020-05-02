const getRawBody = require('raw-body')
const { xml2Json } = require('../util')

exports = module.exports = async (ctx, next) => {
  const { req, headers } = ctx

  const data = await getRawBody(req, {
    length: headers['content-length'],
    limit: '1mb',
    encoding: true
  }).catch(err => {
    console.info('获取微信请求body出错')
    console.error(err)
  })

  let wechatBody = {}
  if(headers['content-type'].includes('xml')) {
    wechatBody = xml2Json(data)
  }else if(headers['content-type'].includes('json')) {
    wechatBody = typeof data === 'string' ? JSON.parse(data) : {}
  }

  console.log('微信的请求', wechatBody)

  ctx.wechatBody = wechatBody
  await next()
}