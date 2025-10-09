// agentnet-backend/src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db');

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
);

const Page = require('./page')(sequelize, DataTypes);
const Standard = require('./standard')(sequelize, DataTypes);
const AdminUser = require('./AdminUser')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Page,
  Standard,
  AdminUser, // ✅ now exported properly
};
