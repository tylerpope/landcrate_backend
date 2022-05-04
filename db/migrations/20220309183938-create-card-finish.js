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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('CardFinishes');
  },
};
