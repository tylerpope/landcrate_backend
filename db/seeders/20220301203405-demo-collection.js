const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Collections', [
    {
      uid: uuidv4(),
      name: 'Atraxa Commander Deck',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: uuidv4(),
      name: 'Blue',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: uuidv4(),
      name: 'Black',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Collections', null, {}),
};
