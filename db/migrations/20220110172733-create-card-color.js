"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CardColors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      cardId: {
        type: Sequelize.UUID,
      },
      color: {
        type: Sequelize.TEXT,
      },
    });
    await queryInterface.addConstraint("CardColors", {
      fields: ["cardId", "color"],
      type: "unique",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CardColors");
  },
};
