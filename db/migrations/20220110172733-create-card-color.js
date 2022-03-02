module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CardColors', {
      cardId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      color: {
        type: Sequelize.TEXT,
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CardColors');
  },
};
