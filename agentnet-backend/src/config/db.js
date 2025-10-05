// agentnet-backend/src/config/db.js
require('dotenv').config()

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agentnet_ai',
  dialect: 'mysql',
}

