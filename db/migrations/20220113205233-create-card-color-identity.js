module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CardColorIdentities', {
      cardId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CardColorIdentities');
  },
};
