const { genReplyXml } = require('../util')

const strategy = {
  default: {
    msgType: 'text',
    content: {
      text: '你说的太复杂了, 老衲听不太懂'
    }
  },
  text: {},
  event: {}
}

class AutoReply {
  constructor() {
  }
  
  addMsgReply(msg, replyFn) {
    const replyType = 'text'
    this.addReply(msg, replyFn, replyType)
  }

  addEventReply(event, replyFn) {
    const replyType = 'event'
    this.addReply(event, replyFn, replyType)
  }

  /**
   * @param { string } msg 用户发送的文本消息
   * @param {priomise|asyncFunction} replyFn
   * @memberof AutoReply
   */
  addReply(msg, replyFn, type) {
    if(typeof replyFn !== 'function') {
      throw Error('请传入函数作为回复内容')
    }

    const genXml = async wechatBody => {
      let replyContent = null

      try{
        replyContent = await replyFn().catch(err => {
          console.log('设置回复内容出错')
          console.error(err)
        })
      }catch(e) {
        replyContent = replyFn()
      }

      if(!replyContent) return null

      return genReplyXml(replyContent.msgType, replyContent.content, wechatBody)
    }

    Object.assign(strategy[type], { [msg]: genXml })
  }

  async reply(ctx) {
    const wechatBody = ctx.wechatBody
    const { MsgType, Content, Event } = wechatBody
    const replyObj = strategy[MsgType]

    let xml = ''

    if(MsgType === 'text' && replyObj[Content]) {
      Object.prototype.toString.call()
      xml = await replyObj[Content](wechatBody)
    }

    if(MsgType === 'event' && replyObj[Event]) {
      xml = await replyObj[Event](wechatBody)
    }

    if(!xml) {
      const defaultReply = strategy.default
      xml = genReplyXml(defaultReply.msgType, defaultReply.content, wechatBody)
    }

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
}

module.exports = AutoReply