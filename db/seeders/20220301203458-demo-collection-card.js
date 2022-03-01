'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("CollectionCards", [
      {
        cardId: '0000579f-7b35-4ed3-b44c-db2a538066fe',
        collectionId: 1,
        priceId: 1,
        quantity: 2,
        type: "NON-FOIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cardId: '0000579f-7b35-4ed3-b44c-db2a538066fe',
        collectionId: 1,
        priceId: 2,
        quantity: 1,
        type: "FOIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("CollectionCards", null, {});
  },
};
