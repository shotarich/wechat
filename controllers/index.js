const Router = require('koa-router')
const sqlExecutor = require('../libs/QuerySql')

const router = new Router()

router.get('/', async (ctx, next) => {
  const sql = 'SELECT `id`, `address`, `age`, `sex`, `img_src` as `imgSrc` FROM `personage` LIMIT 0, 10'
  const characters = await sqlExecutor.query(sql).catch(err => {
    console.error('获取人物列表时查库失败')
    console.error(err)
  })

  const list = characters.map(item => ({
      age: item.age,
      address: item.address,
      src: `/imgs/${item.imgSrc}`
  }))

  const renderData = {list}
  await ctx.render('index', renderData)
})

exports = module.exports = router