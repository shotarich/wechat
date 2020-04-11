const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const tpl = require('../template/tpl')
const htmlparser2 = require('htmlparser2')
const Material = require('../wechat/Material')
const { temp_material_file_path } = require('../constants/wechat')

const encryptType = (type, str) => {
  return crypto.createHash(type).update(str).digest('hex').toLowerCase()
}

const types = util.types

const xml2Json = xml => {
  const json = {}
  let curKey = ''
  let curVal = null

  const parser = new htmlparser2.Parser(
    {
      onopentag(tagname) {
        if(tagname === 'xml') return
       
        curKey = tagname

        if(tagname in json && json[tagname]) {
          const val = json[tagname]
          json[tagname] = [val]
        }
      },
      ontext(text) {
        curVal = text.trim()
      },
      onclosetag(tagname) {
        if(tagname === 'xml') return
       
        Array.isArray(json[curKey]) ? json[curKey].push(curVal) : (json[curKey] = curVal)
      },
    },
    { decodeEntities: true, xmlMode: true }
  )
  parser.write(xml)
  parser.end()
  
  return json
}

const genReplyXml = (msgType, content, formatedMsg) => {
  const replyJson = {}
  const { FromUserName, ToUserName } = formatedMsg

  msgType = msgType || 'text'
  Array.isArray(content) && (msgType = 'news')
  replyJson.content = content
  replyJson.msgType = msgType
  replyJson.createTime = Date.now()
  replyJson.fromUserName = ToUserName
  replyJson.toUserName = FromUserName

  return tpl.compile(replyJson)
}

const isEmptyObj = v => {
  return !Boolean(Object.keys(v).length)
}

const isEnableTempMaterial = materialInfos => {
  const now = Date.now()

  return materialInfos && !isEmptyObj(materialInfos) && now < materialInfos.created_at * 1000 + 3600 * 1000 * 24 * 3
}

const getTempMaterial = () => {
  return fs.promises.readFile(temp_material_file_path, 'utf8')
}

const saveTempMaterial = async materialInfos => {
  if(!materialInfos && typeof materialInfos !== 'object') {
    return Promise.reject('请传入要写入的临时素材信息')
  }

  let allTempMaterialInfos = await getTempMaterial().catch(err => {
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
  return fs.promises.writeFile(temp_material_file_path, materialInfos, 'utf8')
}

const genTempMaterialInfos = async (msg, materialType, materialPath) => {
  const material = new Material()

  let allTempMaterialInfos = await getTempMaterial().catch(err => {
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
  
  if(!isEnableTempMaterial(tempMaterialInfos)) {
    tempMaterialInfos = await material.uploadTempMaterial(materialType, materialPath)
    tempMaterialInfos.msg = msg
  }

  await saveTempMaterial(tempMaterialInfos).catch(err => {
    console.log('缓存临时素材id时出错')
    console.error(err)
  })

  return tempMaterialInfos
}

module.exports = {
  types,
  xml2Json,
  genReplyXml,
  getTempMaterial,
  saveTempMaterial,
  genTempMaterialInfos,
  isEnableTempMaterial,
  md5: str => encryptType('md5', str),
  sha1: str => encryptType('sha1', str)
}