const path = require('path')

module.exports = {
  appID: 'wxc4e3e5b7f82571fa',
  appSecret: '329699e2c75bdc44217d9900905550b2',
  token: 'feelings_test_token',

  // appID: 'wx54a1f8e41f3ae782',
  // appSecret: '26f2e30cabfc699536c0ed60962ef5d2',
  // token: 'feeling_life_shotarich_9527',
  
  api_prefix_url: 'https://api.weixin.qq.com',
  api_upload_temp_material_path: '/cgi-bin/media/upload',
  api_access_token_path: '/cgi-bin/token?grant_type=client_credential',
  api_create_menu_path: '/cgi-bin/menu/create',
  
  access_token_file_path: path.join(__dirname, '../config/access_token.json'),
  temp_material_file_path: path.join(__dirname, '../config/material_infos.json'),
}