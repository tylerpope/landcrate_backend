"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CardPrices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      cardId: {
        type: Sequelize.UUID,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      type: {
        type: Sequelize.ENUM("FOIL", "NON-FOIL", "ETCHED"),
      },
    });
    await queryInterface.addConstraint("CardPrices", {
      fields: ["cardId", "type"],
      type: "unique",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CardPrices");
  },
};
