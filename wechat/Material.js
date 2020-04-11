const fs = require('fs')
const request = require('request-promise')
const config = require('../constants/wechat')
const AccessToken = require('../libs/AccessToken')

class Material extends AccessToken{
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
      const { api_prefix_url, api_upload_temp_material_path } = config
      const url = `${api_prefix_url + api_upload_temp_material_path}?access_token=${token}&type=${msgType}`

      const uploadRet =  await this._upload(url, formData)
      console.log('上传了一次临时素材')

      if(uploadRet && uploadRet.created_at.toString().length < 13) {
        uploadRet.created_at *= 1000 
      }

      return uploadRet
    }catch(e) {
      console.log('获取access_token出错')
      console.error(e)
    }
  }

  async _upload(url, formData) {
    const uploadRet = await request({
      url,
      formData,
      method: 'post',
      json: true
    }).catch(err => {
      console.log('素材上传失败')
      console.error(err)
    })

    if(!uploadRet) {
      return null
    }

    if('errcode' in uploadRet) {
      console.log(`上传素材有误, 错误代码: ${uploadRet.errcode}, 错误信息: `)
      console.error(uploadRet.errmsg)
      return null
    }

    return uploadRet
  }
}

module.exports = Material