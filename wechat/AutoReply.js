const { genReplyXml, types } = require('../util')

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
  constructor(ctx) {
    this.ctx = ctx
    this.wechatBody = ctx.wechatBody
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

    const reply = () => {
      const reply = replyFn()

      if(types.isPromise(reply) || types.isAsyncFunction(replyFn)) {
        reply.then(data => {
          this.fire(data)
        }).catch(err => {
          console.log('设置回复内容出错')
          console.error(err)
        })

        return
      }
      
      return this.fire(reply)
    }

    Object.assign(strategy[type], { [msg]: reply })
  }

  fire(reply) {
    const ctx = this.ctx
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = genReplyXml(reply.msgType, reply.content, this.wechatBody)
  }

  reply() {
    const ctx = this.ctx
    const { MsgType, Content, Event } = this.wechatBody
    const replyObj = strategy[MsgType]

    if(MsgType === 'text' && replyObj[Content]) {
      replyObj[Content](ctx)
    }else if(MsgType === 'event' && replyObj[Event]) {
      replyObj[Event](ctx)
    }else {
      this.fire(strategy.default)
    }
  }
}

module.exports = AutoReply