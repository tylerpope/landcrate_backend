module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CardColors', {
      cardId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CardColors');
  },
};
