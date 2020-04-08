/**
 * 此模块用来验证接入微信
 */
const { sha1 } = require('../util')
const config = require('../constants/wechat')

exports = module.exports = async function validWechatAccess(ctx, next) {
  const token = config.token
  const { signature, nonce, timestamp, echostr } = ctx.query

  const str = [token, timestamp, nonce].sort().join('')
  const encryptoStr = sha1(str)

  if(encryptoStr !== signature) {
    ctx.body = 'error'
    return
  }

  ctx.body = echostr

  await next()
}