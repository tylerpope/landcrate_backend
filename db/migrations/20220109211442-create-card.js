module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cards', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      arenaId: {
        type: Sequelize.INTEGER,
      },
      lang: {
        type: Sequelize.TEXT,
      },
      mtgoId: {
        type: Sequelize.INTEGER,
      },
      mtgoFoilId: {
        type: Sequelize.INTEGER,
      },
      tcgPlayerId: {
        type: Sequelize.INTEGER,
      },
      tcgPlayerEtchedId: {
        type: Sequelize.INTEGER,
      },
      cardmarketId: {
        type: Sequelize.INTEGER,
      },
      oracleUUID: {
        type: Sequelize.UUID,
      },
      printsSearchUri: {
        type: Sequelize.TEXT,
      },
      rulingsUri: {
        type: Sequelize.TEXT,
      },
      scryfallUri: {
        type: Sequelize.TEXT,
      },
      cardFaces: {
        type: Sequelize.JSON,
      },
      convertedManaCost: {
        type: Sequelize.FLOAT,
      },
      edhrecRank: {
        type: Sequelize.INTEGER,
      },
      handModifier: {
        type: Sequelize.TEXT,
      },
      layout: {
        type: Sequelize.TEXT,
      },
      lifeModifier: {
        type: Sequelize.TEXT,
      },
      loyalty: {
        type: Sequelize.TEXT,
      },
      manaCost: {
        type: Sequelize.TEXT,
      },
      name: {
        type: Sequelize.TEXT,
      },
      oracleText: {
        type: Sequelize.TEXT,
      },
      power: {
        type: Sequelize.TEXT,
      },
      toughness: {
        type: Sequelize.TEXT,
      },
      typeLine: {
        type: Sequelize.TEXT,
      },
      artist: {
        type: Sequelize.TEXT,
      },
      imageUris: {
        type: Sequelize.JSON,
      },
      borderColor: {
        type: Sequelize.ENUM('black', 'white', 'borderless', 'silver', 'gold'),
      },
      cardBackId: {
        type: Sequelize.UUID,
      },
      collectorNumber: {
        type: Sequelize.TEXT,
      },
      flavorName: {
        type: Sequelize.TEXT,
      },
      flavorText: {
        type: Sequelize.TEXT,
      },
      frame: {
        type: Sequelize.TEXT,
      },
      illustrationId: {
        type: Sequelize.UUID,
      },
      imageStatus: {
        type: Sequelize.TEXT,
      },
      printedName: {
        type: Sequelize.TEXT,
      },
      printedText: {
        type: Sequelize.TEXT,
      },
      printedTypeLine: {
        type: Sequelize.TEXT,
      },
      purchaseUris: {
        type: Sequelize.JSON,
      },
      rarity: {
        type: Sequelize.TEXT,
      },
      releasedAt: {
        type: Sequelize.DATE,
      },
      setCode: {
        type: Sequelize.TEXT,
      },
      setId: {
        type: Sequelize.UUID,
      },
      setName: {
        type: Sequelize.TEXT,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cards');
  },
};
