module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CardColorIdentities', {
      cardId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      color: {
        type: Sequelize.TEXT,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CardColorIdentities');
  },
};
