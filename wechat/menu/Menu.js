const menuConf = require('./menuConf')
const request = require('../../libs/request')
const { api_prefix_url, api_create_menu_path } = require('../../constants/wechat')

class Menu{
  constructor() {
    this.init()
  }

  async init() {
    try {
      const opts = {
        url: api_prefix_url + api_create_menu_path,
        attachToken: true,
        body: menuConf,
      }
      await this.createMenu(opts)
    }catch(e) {
      console.log('创建菜单时获取access_token失败')
      console.error(e);
    }
  }

  async createMenu(opts) {
    const createMenuRet = await request({
      ...opts,
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