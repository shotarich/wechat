/**
 * 此模块为AccessToken类, 用来获取/更新access_token
 */
const fs = require('fs')
const request = require('request-promise')
const config = require('../constants/wechat')
const { access_token_file_path } = require('../constants/wechat')

class AccessToken {
  constructor() {
    this.appID = config.appID
    this.appSecret = config.appSecret
  }

  async getAccessToken() {
    let access_token = await fs.promises.readFile(access_token_file_path, 'utf8').catch(err => {
      console.log('从文件中获取access_token出错')
      console.error(err)
    })

    try {
      access_token = JSON.parse(access_token)
    } catch(e) {
      access_token = await this.updateAccessToken()
    }

    if(this.isDisabled(access_token)) {
      access_token = await this.updateAccessToken()
    }

    return access_token || null
  }

  async setAccessToken(access_token) {
    if(this.isDisabled(access_token)) {
      access_token = await this.updateAccessToken()
    }

    const access_token_infos = JSON.stringify(access_token, null, 2)
    const ret = await fs.promises.writeFile(access_token_file_path, access_token_infos, 'utf8').catch(err => {
      console.log('存入access_toekn至文件时出错')
      console.error(err)
    })

    return Boolean(ret)
  }

  async updateAccessToken() {
    const { appID, appSecret } = this
    const url = `${config.api_prefix_url + config.api_access_token_path}&appid=${appID}&secret=${appSecret}`

    const resp = await request({
      url,
      json: true
    }).catch(err => {
      console.log('更新access_token出错')
      console.error(err)
    })

    const access_token = {
      access_token: resp.access_token,
      expires_in: Date.now() - 20 + resp.expires_in * 1000
    }

    this.setAccessToken(access_token)

    return access_token
  }

  isDisabled(access_token) {
    if(!access_token || !access_token.access_token || !access_token.expires_in) {
      return true
    }

    const { expires_in } = access_token
    const nowTimestamp = Date.now()
    
    return nowTimestamp > expires_in
  }
}

module.exports = AccessToken