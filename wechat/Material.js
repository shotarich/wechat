const fs = require('fs')
const { isEmptyObj } = require('../util')
const request = require('request-promise-native')
const config = require('../constants/wechat')
const AccessToken = require('../libs/AccessToken')

class Material extends AccessToken{
  constructor() {
    super()
  }

  async genTempMaterialInfos(msg, materialType, materialPath) {  
    let allTempMaterialInfos = await this.getTempMaterial().catch(err => {
      console.log('获取临时素材信息出错, 对应的消息内容是:' + msg)
      console.error(err)
    })
    let tempMaterialInfos = null
  
    try {
      allTempMaterialInfos = JSON.parse(allTempMaterialInfos)
      tempMaterialInfos = allTempMaterialInfos.find(item => item.msg === msg) || null
    }catch(e) {
      tempMaterialInfos = null
    }
    
    if(!this.isEnableTempMaterial(tempMaterialInfos)) {
      tempMaterialInfos = await this.uploadTempMaterial(materialType, materialPath)
      tempMaterialInfos.msg = msg
    }
  
    await this.saveTempMaterial(tempMaterialInfos).catch(err => {
      console.log('缓存临时素材id时出错')
      console.error(err)
    })
  
    return tempMaterialInfos
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
      console.log('上传临时素材时获取access_token出错')
      console.error(e)
    }
  }

  getTempMaterial() {
    return fs.promises.readFile(config.temp_material_file_path, 'utf8')
  }
  
  async saveTempMaterial(materialInfos) {
    if(!materialInfos || typeof materialInfos !== 'object') {
      return Promise.reject('请传入要写入的临时素材信息')
    }

    let allTempMaterialInfos = await this.getTempMaterial().catch(err => {
      console.log('在存入临时素材时读取临时素材信息文件出错')
      console.error(err)
    })

    try {
      allTempMaterialInfos = JSON.parse(allTempMaterialInfos)

      if(!Array.isArray(allTempMaterialInfos)) {
        allTempMaterialInfos = []
      }
    }catch(e) {
      allTempMaterialInfos = []
    }
    
    const targetIndex = allTempMaterialInfos.findIndex(item => item.msg === materialInfos.msg)
    if(~targetIndex) {
      allTempMaterialInfos[targetIndex] = materialInfos
    }else {
      allTempMaterialInfos.push(materialInfos)
    }

    materialInfos = JSON.stringify(allTempMaterialInfos, null, 2)
    return fs.promises.writeFile(config.temp_material_file_path, materialInfos, 'utf8')
  }
  
  isEnableTempMaterial(materialInfos) {
    const now = Date.now()

    return materialInfos && !isEmptyObj(materialInfos) && now < materialInfos.created_at * 1000 + 3600 * 1000 * 24 * 3
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