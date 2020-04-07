const fs = require('fs')
const request = require('request-promise')
const { genReplyXml } = require('../util')
const config = require('../constants/wxToken')
const AccessToken = require('./AccessToken')
const access_token_conf = require('../config/access_token')

class Wechat {
  constructor() {
    const validateConf = {
      appID: config.appID,
      appSecret: config.appSecret,
      ...access_token_conf
    }

    this.accessToken = new AccessToken(validateConf)
  }

  reply(ctx) {
    if(ctx.body === '') return

    const { msgType, content } = ctx.body
    const formatedMsg = ctx.formatedMsg
    const replyXml = genReplyXml(msgType, content, formatedMsg)

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = replyXml
  }

  uploadTempMaterial(msgType, filePath) {
    return new Promise((resolve, reject) =>{
      const formData = {
        media: fs.createReadStream(filePath)
      }
  
      this.accessToken.get().then(access_token => {
        const url = `${config.api_prefix_url + upload_temp_material_path}?access_token=${access_token}&type=${msgType}`
  
        request({
          url,
          formData,
          method: 'post',
        }).then(resp => {
          if(resp) {
            resolve(resp)
          }else {
            throw Error('upload material fails')
          }
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
}

module.exports = Wechat