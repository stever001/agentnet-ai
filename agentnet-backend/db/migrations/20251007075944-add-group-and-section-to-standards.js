"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Standards", "group", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "AgentNet Standards",
    });

    await queryInterface.addColumn("Standards", "section", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Standards", "group");
    await queryInterface.removeColumn("Standards", "section");
  },
};

