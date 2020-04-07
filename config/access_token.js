const fs = require('fs')
const { access_token_file } = require('../constants/wxToken')

module.exports = {
  getAccessToken() {
    return fs.promises.readFile(access_token_file)
  },

  setAccessToken(data) {
    const access_token_infos = JSON.stringify(data, null, 2)

    return fs.promises.writeFile(access_token_file, access_token_infos)
  }
}