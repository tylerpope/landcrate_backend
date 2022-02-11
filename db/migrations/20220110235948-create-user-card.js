"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      cardId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      priceId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM("FOIL", "NON-FOIL", "ETCHED"),
        primaryKey: true,
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
    await queryInterface.addConstraint("UserCards", {
      fields: ["cardId", "type"],
      type: "unique",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserCards");
  },
};
