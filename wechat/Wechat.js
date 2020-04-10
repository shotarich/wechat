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

      console.log(uploadRet)

      if('errcode' in uploadRet) {
        console.log(`上传素材有误, 错误代码: ${uploadRet.errcode}, 错误信息: `)
        console.error(uploadRet.errmsg)
        return null
      }

      if(uploadRet.created_at && uploadRet.created_at.toString().length < 13) {
        uploadRet.created_at *= 1000 
      }
      console.log('上传了一次素材')

      return uploadRet
    }catch(e) {
      console.log('获取access_token出错')
      console.error(e)
    }
  }
}

module.exports = Wechat