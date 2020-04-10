const fs = require('fs')
const request = require('request-promise')
const config = require('../constants/wechat')
const AccessToken = require('../libs/AccessToken')

class Wechat extends AccessToken {
  constructor() {
    super()
  }

  async uploadTempMaterial(msgType, filePath) {
    const formData = {
      media: fs.createReadStream(filePath)
    }

    const access_token = await this.getAccessToken()

    try{
      const token = access_token.access_token
      const url = `${config.api_prefix_url + config.api_upload_temp_material_path}?access_token=${token}&type=${msgType}`

      const uploadRet = await request({
        url,
        formData,
        method: 'post',
        json: true
      }).catch(err => {
        console.log('临时素材新增失败')
        console.error(err)
      })

      console.log('上传临时素材', uploadRet)

      return uploadRet
    }catch(e) {
      throw Error(e)
    }
  }
}

module.exports = Wechat