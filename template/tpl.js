const ejs = require('ejs')
const heredoc = require('heredoc')

const tpl = heredoc(() => {/*
  <xml>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>

    <% if(msgType === 'text') { %>
      <Content><![CDATA[<%= content.text %>]]></Content>
    <% }else if(msgType === 'image') { %>
      <Image>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
      </Image>
    <% }else if(msgType === 'voice') { %>
      <Voice>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
      </Voice>
    <% }else if(msgType === 'vedio') { %>
      <Video>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        <Title><![CDATA[<%= content.vedio_title %>]]></Title>
        <Description><![CDATA[<%= content.vedio_description %>]]></Description>
      </Video>
    <% }else if(msgType === 'music') { %>
      <Music>
        <Title><![CDATA[<%= content.music_title %>]]></Title>
        <Description><![CDATA[<%= content.music_description %>]]></Description>
        <MusicUrl><![CDATA[<%= content.music_url %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%= content.hq_music_url %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%= content.media_id %>]]></ThumbMediaId>
      </Music>
    <% }else if(msgType === 'news') { %>
      <ArticleCount><%= content.length %></ArticleCount>
      <Articles>
        <% content.forEach(item => { %>
          <item>
            <Title><![CDATA[<%= item.news_title %>]]></Title>
            <Description><![CDATA[<%= item.news_description %>]]></Description>
            <PicUrl><![CDATA[<%= item.news_pic_url %>]]></PicUrl>
            <Url><![CDATA[<%= item.news_url %>]]></Url>
          </item>
        <% }) %>
      </Articles>
    <% } %>
  </xml>
*/})

const compile = ejs.compile(tpl, { rmWhitespace : true })
module.exports = { 
  compile
}