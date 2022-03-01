"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CardPrices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      cardId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      type: {
        type: Sequelize.ENUM("FOIL", "NON-FOIL", "ETCHED"),
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CardPrices");
  },
};
