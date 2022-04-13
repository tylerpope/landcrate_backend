module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardFinishes', {
      cardId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      finish: {
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
  async down(queryInterface) {
    await queryInterface.dropTable('CardFinishes');
  },
};
