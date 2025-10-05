// agentnet-backend/src/models/page.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Page', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING(191), unique: true, allowNull: false },
    title: { type: DataTypes.STRING(191), allowNull: false },
    content_md: { type: DataTypes.TEXT('long'), allowNull: false },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'published',
    },
  }, {
    tableName: 'pages',
  })
}

