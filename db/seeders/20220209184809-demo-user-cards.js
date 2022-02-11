"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("UserCards", [
      {
        cardId: "0000579f-7b35-4ed3-b44c-db2a538066fe",
        userId: 1,
        quantity: 1,
        priceId: 1,
        type: "NON-FOIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cardId: "0000a54c-a511-4925-92dc-01b937f9afad",
        userId: 1,
        quantity: 1,
        priceId: 7,
        type: "NON-FOIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserCards", null, {});
  },
};
