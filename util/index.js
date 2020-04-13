const util = require('util')
const crypto = require('crypto')
const tpl = require('../template/tpl')
const htmlparser2 = require('htmlparser2')

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

module.exports = {
  types,
  xml2Json,
  isEmptyObj,
  genReplyXml,
  md5: str => encryptType('md5', str),
  sha1: str => encryptType('sha1', str)
}