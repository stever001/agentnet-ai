// agentnet-backend/src/models/standard.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define(
    'Standard',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      slug: { type: DataTypes.STRING(191), unique: true, allowNull: false },
      title: { type: DataTypes.STRING(191), allowNull: false },
      summary: { type: DataTypes.TEXT },
      content_md: { type: DataTypes.TEXT('long'), allowNull: false },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft',
      },
      version: { type: DataTypes.STRING },
    },
    {
      tableName: 'standards',
    }
  )
}

