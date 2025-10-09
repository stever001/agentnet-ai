// agentnet-backend/src/models/AdminUser.js
module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define(
    'AdminUser',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'admin',
      },
    },
    {
      tableName: 'AdminUsers',
      timestamps: true,
    }
  );

  // Instance method for password validation
  AdminUser.prototype.checkPassword = async function (password) {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, this.passwordHash);
  };

  return AdminUser;
};
