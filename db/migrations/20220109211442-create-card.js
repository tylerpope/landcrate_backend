module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cards', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      arenaId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
      mtgoId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      mtgoFoilId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      tcgPlayerId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      tcgPlayerEtchedId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      cardmarketId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      oracleUUID: {
        type: Sequelize.DataTypes.UUID,
      },
      printsSearchUri: {
        type: Sequelize.DataTypes.TEXT,
      },
      rulingsUri: {
        type: Sequelize.DataTypes.TEXT,
      },
      scryfallUri: {
        type: Sequelize.DataTypes.TEXT,
      },
      cardFaces: {
        type: Sequelize.DataTypes.JSON,
      },
      convertedManaCost: {
        type: Sequelize.DataTypes.FLOAT,
      },
      edhrecRank: {
        type: Sequelize.DataTypes.INTEGER,
      },
      handModifier: {
        type: Sequelize.DataTypes.TEXT,
      },
      layout: {
        type: Sequelize.DataTypes.TEXT,
      },
      lifeModifier: {
        type: Sequelize.DataTypes.TEXT,
      },
      loyalty: {
        type: Sequelize.DataTypes.TEXT,
      },
      manaCost: {
        type: Sequelize.DataTypes.TEXT,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
      },
      oracleText: {
        type: Sequelize.DataTypes.TEXT,
      },
      power: {
        type: Sequelize.DataTypes.TEXT,
      },
      toughness: {
        type: Sequelize.DataTypes.TEXT,
      },
      typeLine: {
        type: Sequelize.DataTypes.TEXT,
      },
      artist: {
        type: Sequelize.DataTypes.TEXT,
      },
      imageUris: {
        type: Sequelize.DataTypes.JSON,
      },
      borderColor: {
        type: Sequelize.DataTypes.ENUM('black', 'white', 'borderless', 'silver', 'gold'),
      },
      cardBackId: {
        type: Sequelize.DataTypes.UUID,
      },
      collectorNumber: {
        type: Sequelize.DataTypes.TEXT,
      },
      flavorName: {
        type: Sequelize.DataTypes.TEXT,
      },
      flavorText: {
        type: Sequelize.DataTypes.TEXT,
      },
      frame: {
        type: Sequelize.DataTypes.TEXT,
      },
      illustrationId: {
        type: Sequelize.DataTypes.UUID,
      },
      imageStatus: {
        type: Sequelize.DataTypes.TEXT,
      },
      printedName: {
        type: Sequelize.DataTypes.TEXT,
      },
      printedText: {
        type: Sequelize.DataTypes.TEXT,
      },
      printedTypeLine: {
        type: Sequelize.DataTypes.TEXT,
      },
      purchaseUris: {
        type: Sequelize.DataTypes.JSON,
      },
      rarity: {
        type: Sequelize.DataTypes.TEXT,
      },
      releasedAt: {
        type: Sequelize.DataTypes.DATE,
      },
      setCode: {
        type: Sequelize.DataTypes.TEXT,
      },
      setId: {
        type: Sequelize.DataTypes.UUID,
      },
      setName: {
        type: Sequelize.DataTypes.TEXT,
      },
      legalities: {
        type: Sequelize.DataTypes.JSON,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Cards');
  },
};
