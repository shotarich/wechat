exports = module.exports = {
  button: [
    {	
      name: "今日歌曲",
      type: "click",
      key: "V1001_TODAY_MUSIC"
    },
    {
      name: "菜单",
      sub_button: [
        {
          "name":"搜索",
          "type":"view",
          "url":"http://www.soso.com/"
        },
        {
          "name":"赞一下我们",
          "type":"click",
          "key":"V1001_GOOD"
        }
      ]
    }
  ]
}