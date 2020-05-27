const fs = require('fs')
const Router = require('koa-router')
const sqlExecutor = require('../libs/QuerySql')
const WESITE_CONFIG = require('../constants/website')

const router = new Router()

router.get('/', async (ctx, next) => {
  const imgs = await fs.promises.readdir(WESITE_CONFIG.IMGS_PATH)

  const sql = 'SELECT * FROM `meets_love`.`personage` LIMIT 0, 10'
  const data = await sqlExecutor.query(sql)
  console.log(data)

  const list = imgs.map(item => {
    const [address, age] = item.split('.')[0].split('-')
    return {
      age,
      address,
      src: `/imgs/${item}`
    }
  })

  const renderData = {list}
  await ctx.render('index', renderData)
})

exports = module.exports = router