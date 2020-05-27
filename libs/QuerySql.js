const mysql = require('mysql')
const {isUndef} = require('../util')
const DB_CONF = require('../constants/database')

class Query {
  constructor() {
    this.dbPool = mysql.createPool({
      connectionLimit: DB_CONF.LIMIT_CONNECTION_COUNT,
      host: DB_CONF.HOST,
      user: DB_CONF.USER,
      password: DB_CONF.PASSWORD,
      database: DB_CONF.DATABASE
    })
  }
  /**
   * @param sqlOpts string|array {sqlOpt: object}
   *
   * @memberof Query
   */
  async query(sqlOpts) {
    let ret = null
    
    if(Array.isArray(sqlOpts)) {
      let len = sqlOpts.length
      ret = new Array(len)
      while(len) {
        const curSqlOpt = sqlOpts.pop()
        const sqlRet = await this._query(curSqlOpt.sqlOpt)

        if(!isUndef(curSqlOpt.field)) {
          ret[field] = sqlRet
        }else {
          ret[--len](sqlRet)
        }
      }
    }else {
      ret = await this._query(sqlOpts)
    }

    return ret
  }

  _createConnection() {
    return new Promise((res, rej) => {
      this.dbPool.getConnection((err, connection) => {
        if(err) return rej(err)
    
        res(connection)
      })
    })
  }

  async _query(sqlOpt) {
    const connection = await this._createConnection().catch(err => {
      console.error('数据库连接失败')
      console.error(err)
    })

    return new Promise((res, rej) => {
      connection.query(sqlOpt, (err, result) => {
        if(err) {
          connection.release()
          return rej(err)
        }

        res(result)
      })
    })
  }
}

exports = module.exports = new Query()
