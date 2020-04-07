// TODO 此类要重写
const request = require('request-promise')
const config = require('../constants/wxToken')

class AccessToken {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.access_token = ''
    this.expires_in = 0

    this.getAccessToken = opts.getAccessToken
    this.setAccessToken = opts.setAccessToken

    this.init()
  }

  init() {
    this.getAccessToken().then(data => {
      let access_token_infos = null

      try{
        access_token_infos = JSON.parse(data)
      }catch(e) {
        return this.saveUpdatedAccessToken()
      }

      if(this.isDisabled(access_token_infos)) {
        return this.saveUpdatedAccessToken()
      }

      return Promise.resolve(access_token_infos)
    }).then(data => {
      this.access_token = data.access_token
      this.expires_in = data.expires_in
    })
  }

  saveUpdatedAccessToken() {
    return new Promise((res, rej) => {
      this.updateAccessToken().then(resp => {
        const access_token_infos = this.saveAccessToken(resp)

        res(access_token_infos)
      }).catch(err => {
        rej(err)
      })
    })
  }

  updateAccessToken() {
    const { appID, appSecret } = this
    const url = `${config.api_prefix_url + config.access_token_path}&appid=${appID}&secret=${appSecret}`

    return new Promise((res, rej) => {
      request({
        url,
        json: true
      }).then(resp => {
        res(resp)
      }).catch(err => {
        rej(err)
      })
    })
  }

  saveAccessToken(access_token_infos) {
    const now = Date.now()
    const expires_in = now + (access_token_infos.expires_in - 20) * 1000
    access_token_infos.expires_in = expires_in

    this.setAccessToken(access_token_infos)

    return access_token_infos
  }

  get() {
    return new Promise((resolve, reject) => {
      if(this.isDisabled(this.access_token)) {
        this.getAccessToken().then(data => {
          let access_token_infos = null
    
          try{
            access_token_infos = JSON.parse(data)
          }catch(e) {
            return this.saveUpdatedAccessToken()
          }
    
          if(this.isDisabled(access_token_infos)) {
            return this.saveUpdatedAccessToken()
          }
    
          return Promise.resolve(access_token_infos)
        }).then(data => {
          this.access_token = data.access_token
          this.expires_in = data.expires_in
          resolve(this.access_token)
        }).catch(err => {
          reject(err)
        })
      }

      resolve(this.access_token)
    })
  }

  isDisabled(access_token_infos) {
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