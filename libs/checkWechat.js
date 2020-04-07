
const { sha1 } = require('../util')
const Wechat = require('./Wechat')
const config = require('../constants/wxToken')

module.exports = function isWechatReq() {
  const wechat = new Wechat()

  return async (ctx, next) => {
    const token = config.token
    const { signature, nonce, timestamp, echostr } = ctx.query

    const str = [token, timestamp, nonce].sort().join('')
    const encryptoStr = sha1(str)

    if(encryptoStr !== signature) {
      ctx.body = 'error'
      return false
    }
    ctx.body = echostr
    ctx.wechat = wechat
    
    await next()
  }
}