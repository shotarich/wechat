const request = require('request-promise-native')
const AccessToken = require('../libs/AccessToken')

async function req(opts) {
  const { attachToken, qs } = opts

  if(attachToken) {
    const token = new AccessToken()
    const accessTokenInfos = await token.getAccessToken().catch(err => {
      console.log('请求之前获取token出错, 报错如下:')
      console.error(err)
    })

    if(!accessTokenInfos) {
      return null
    }

    const access_token = accessTokenInfos.access_token
    opts.qs = {
      access_token,
      ...qs
    }

    delete opts.attachToken
  }

  return request(opts)
}

exports = module.exports = req