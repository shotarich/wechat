const util = require('util')
const path = require('path')
const crypto = require('crypto')
const tpl = require('../template/tpl')
const htmlparser2 = require('htmlparser2')
const WEBSITE_CONF = require('../constants/website')

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

const genAbsolutePath = (curPath, basePath = WEBSITE_CONF.ROOT_PATH) => {
  return path.join(
    '/',
    path.format({
      root: '/',
      base: path.relative(basePath, curPath)
    })
  )
}

const isUndef = v => v == undefined

module.exports = {
  types,
  isUndef,
  xml2Json,
  isEmptyObj,
  genReplyXml,
  genAbsolutePath,
  md5: str => encryptType('md5', str),
  sha1: str => encryptType('sha1', str)
}