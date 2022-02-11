"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CardColorIdentities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cardId: {
        type: Sequelize.UUID,
      },
      color: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("CardColorIdentities", {
      fields: ["cardId", "color"],
      type: "unique",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CardColorIdentities");
  },
};
