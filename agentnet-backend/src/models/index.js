// agentnet-backend/src/models/index.js
const { Sequelize } = require('sequelize')
const config = require('../config/db')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  }
)

const Page = require('./page')(sequelize)
const Standard = require('./standard')(sequelize)

module.exports = {
  sequelize,  // ✅ make sure this is exported
  Page,
  Standard,
}
