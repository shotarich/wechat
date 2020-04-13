const menuConf = require('./menuConf')
const request = require('request-promise-native')
const AccessToken = require('../../libs/AccessToken')
const { api_prefix_url, api_create_menu_path } = require('../../constants/wechat')

class Menu extends AccessToken {
  constructor() {
    super()

    this.init()
  }

  async init() {
    const access_token = await this.getAccessToken().catch(e => console.log(e))

    try {
      const url = `${api_prefix_url + api_create_menu_path}?access_token=${access_token.access_token}`
      await this.createMenu(url, menuConf)
    }catch(e) {
      console.log('创建菜单时获取access_token失败')
      console.error(e);
    }
  }

  async createMenu(url, menu) {
    const createMenuRet = await request({
      url,
      body: menu,
      method: 'post',
      json: true
    }).catch(err => {
      console.log('创建菜单失败, 失败原因:')
      console.error(err)
    })

    console.log('创建菜单返回:', createMenuRet)
    return createMenuRet
  }
}

exports = module.exports = Menu