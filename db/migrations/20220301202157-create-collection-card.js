module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CollectionCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cardId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      collectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      priceId: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM('NM', 'SP', 'MP', 'HP'),
        allowNull: false,
      },
      language: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      purchasePrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('FOIL', 'NON-FOIL', 'ETCHED'),
        allowNull: false,
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
    await queryInterface.addConstraint('CollectionCards', {
      fields: ['cardId', 'type', 'condition', 'language', 'purchasePrice'],
      type: 'unique',
      name: 'collectionCard_id_type',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CollectionCards');
  },
};
