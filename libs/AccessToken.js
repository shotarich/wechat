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
    this.access_token = null

    this.init()
  }

  async init() {
    if(this.isDisabled()) {
      await this.updateAccessToken()
    }
    
    const access_token_infos = JSON.stringify(this.access_token, null, 2)
    fs.promises.writeFile(access_token_file_path, access_token_infos).catch(err => {
      console.log('存入access_toekn至文件时出错')
      console.error(err)
    })
  }

  async getAccessToken() {
    this.access_token = await fs.promises.readFile(access_token_file_path).catch(err => {
      console.log('从文件中获取access_token出错')
      console.error(err)
    })

    if(this.isDisabled()) {
      await this.updateAccessToken()
    }

    return this.access_token || null
  }

  async setAccessToken() {
    if(this.isDisabled()) {
      await this.updateAccessToken()
    }

    const access_token_infos = JSON.stringify(this.access_token, null, 2)
    const ret = await fs.promises.writeFile(access_token_file_path, access_token_infos).catch(err => {
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

    this.access_token = resp
  }

  isDisabled() {
    const access_token_infos = this.access_token
    if(!access_token_infos || !access_token_infos.access_token || !access_token_infos.expires_in) {
      return true
    }

    const { expires_in } = access_token_infos
    const nowTimestamp = Date.now()
    if(nowTimestamp > expires_in) {
      return true
    }

    return false
  }
}

module.exports = AccessToken