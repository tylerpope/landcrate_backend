module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CardPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      cardId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      price: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.ENUM('FOIL', 'NON-FOIL', 'ETCHED'),
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CardPrices');
  },
};
