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
  constructor(ctx, next) {
    this.ctx = ctx
    this.wechatMsg = ctx.wechatMsg
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
    if(!this.isPromiseOrAsyncFn(replyFn)) {
      throw Error('请传入promise或async函数作为回复内容')
    }

    const { wechatMsg } = this
    const reply = ctx => {
      replyFn.then(reply => {
        const replyXml = genReplyXml(reply.msgType, reply.content, wechatMsg)
        ctx.status = 200
        ctx.type = 'application/xml'
        ctx.body = replyXml
      })
    }

    Object.assign(strategy[type], { [msg]: reply })
  }

  reply() {
    const ctx = this.ctx
    const { MsgType, Content, Event } = this.wechatMsg
    const replyObj = strategy[MsgType]

    if(MsgType === 'text' && replyObj[Content]) {
      replyObj[Content](ctx)
    }else if(MsgType === 'event' && replyObj[Event]) {
      replyObj[Event](ctx)
    }else {
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = genReplyXml(strategy.default.msgType, strategy.default.content, this.wechatMsg)
    }
  }

  isPromiseOrAsyncFn(v) {
    return ['[object Promise]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(v))
  }
}

module.exports = AutoReply