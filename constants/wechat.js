const path = require('path')

module.exports = {
  appID: 'wxc4e3e5b7f82571fa',
  appSecret: '329699e2c75bdc44217d9900905550b2',
  token: 'feelings_test_token',
  
  api_prefix_url: 'https://api.weixin.qq.com',
  api_upload_temp_material_path: '/cgi-bin/media/upload',
  api_access_token_path: '/cgi-bin/token?grant_type=client_credential',
  
  access_token_file_path: path.join(__dirname, '../config/access_token.json'),
}