const isFn = fn => typeof fn === 'function'
const isAsyncFn = fn => Object.prototype.toString.call(fn) === '[object AsyncFunction]'

module.exports = ctx => {
  const replyConf =  {
    event: {
      // 关注事件
      subscribe(beforeFn) {
        typeof beforeFn === 'function' && beforeFn()

        return {
          msgType: 'text',
          content: {
            text: '欢迎关注此微信公众号'
          }
        }
      },

      // 取消关注事件
      unsubscribe(beforeFn) {
        typeof beforeFn === 'function' && beforeFn()

        return ''
      },

      // 上报地理位置事件
      LOCATION(beforeFn) {
        typeof beforeFn === 'function' && beforeFn()

        return {
          msgType: 'text',
          content: {
            text: '欢迎关注此微信公众号'
          }
        }
      }
    },

    // 接收到普通文本消息
    text: [
      {
        reply() {
          return {
            msgType: 'text',
            content: {
              text: '您说的太复杂了，我不太懂呢'
            }
          }
        }
      },
      {
        content: '1',
        reply(beforeFn) {
          typeof beforeFn === 'function' && beforeFn()

          return {
            msgType: 'text',
            content: {
              text: '接收到您发的消息“1”'
            }
          }
        }
      },
      {
        content: '2',
        reply(beforeFn) {
          typeof beforeFn === 'function' && beforeFn()

          return {
            msgType: 'news',
            content: [
              {
                news_title: '技术改变世界',
                news_description: '只是个描述而已',
                news_pic_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586190186379&di=df848b40c380f5d2e3856a051cbdfa1f&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170730%2F10f550cc7049401f92d48a5f2db203c7_th.png',
                news_url: 'https://github.com'
              },
              {
                news_title: 'Node.js教程',
                news_description: '第一课',
                news_pic_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586190130113&di=9004f4625f617bb263209e935d4089d9&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2Fv2-e3f9f5f051fc851aef94bc91b9f0f5b1_1200x500.jpg',
                news_url: 'https://nodejs.org'
              }
            ]
          }
        }
      },
      {
        content: '3',
        reply(beforeFn, additionContent) {
          typeof beforeFn === 'function' && beforeFn()

          return {
            msgType: 'image',
            content: {
              ...additionContent,
            }
          }
        }
      }
    ]
  }

  return replyConf
}