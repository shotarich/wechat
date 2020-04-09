const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const htmlparser2 = require('htmlparser2')
const tpl = require('../template/tpl')
const { temp_material_file_path } = require('../constants/wechat')

const encryptType = (type, str) => {
  return crypto.createHash(type).update(str).digest('hex').toLowerCase()
}

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

const isEnableTempMaterial = materialInfos => {
  const now = Date.now()

  return Boolean(materialInfos.expires_in) && now < materialInfos.expires_in
}

const saveTempMaterial = materialInfos => {
  if(!materialInfos && typeof materialInfos === 'object') {
    throw Error('请传入要写入的临时素材信息')
  }

  materialInfos = JSON.stringify(materialInfos)
  return fs.promises.writeFileSync(temp_material_file_path, materialInfos, 'utf8')
}

module.exports = {
  xml2Json,
  genReplyXml,
  types: util.types,
  saveTempMaterial,
  isEnableTempMaterial,
  md5: str => encryptType('md5', str),
  sha1: str => encryptType('sha1', str)
}