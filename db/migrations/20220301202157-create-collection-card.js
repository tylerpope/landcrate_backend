module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CollectionCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      cardId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      collectionId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      priceId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      condition: {
        type: Sequelize.DataTypes.ENUM('NM', 'SP', 'MP', 'HP'),
        allowNull: false,
      },
      language: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      purchasePrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.addConstraint('CollectionCards', {
      fields: ['cardId', 'type', 'condition', 'language', 'purchasePrice', 'collectionId'],
      type: 'unique',
      name: 'CollectionCard_Unique',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('CollectionCards');
  },
};
