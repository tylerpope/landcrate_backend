module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sets', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
      },
      parentSetCode: {
        type: Sequelize.STRING,
      },
      setType: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sets');
  },
};
