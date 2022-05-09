const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CollectionCard, { foreignKey: 'cardId' });
      this.hasMany(models.CardPrice, { foreignKey: 'cardId' });
      this.hasMany(models.CardColor, { foreignKey: 'cardId' });
      this.hasMany(models.CardFinish, { foreignKey: 'cardId' });
      this.belongsTo(models.Set, { foreignKey: 'setId' });
    }
  }
  Card.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      arenaId: DataTypes.INTEGER,
      lang: DataTypes.TEXT,
      mtgoId: DataTypes.INTEGER,
      mtgoFoilId: DataTypes.INTEGER,
      tcgPlayerId: DataTypes.INTEGER,
      tcgPlayerEtchedId: DataTypes.INTEGER,
      cardmarketId: DataTypes.INTEGER,
      oracleUUID: DataTypes.UUID,
      printsSearchUri: DataTypes.TEXT,
      rulingsUri: DataTypes.TEXT,
      scryfallUri: DataTypes.TEXT,
      cardFaces: DataTypes.JSON,
      convertedManaCost: DataTypes.FLOAT,
      edhrecRank: DataTypes.INTEGER,
      handModifier: DataTypes.TEXT,
      layout: DataTypes.TEXT,
      lifeModifier: DataTypes.TEXT,
      loyalty: DataTypes.TEXT,
      manaCost: DataTypes.TEXT,
      name: DataTypes.TEXT,
      oracleText: DataTypes.TEXT,
      power: DataTypes.TEXT,
      toughness: DataTypes.TEXT,
      typeLine: DataTypes.TEXT,
      artist: DataTypes.TEXT,
      imageUris: DataTypes.JSON,
      borderColor: DataTypes.ENUM(
        'black',
        'white',
        'borderless',
        'silver',
        'gold',
      ),
      cardBackId: DataTypes.UUID,
      collectorNumber: DataTypes.TEXT,
      flavorName: DataTypes.TEXT,
      flavorText: DataTypes.TEXT,
      frame: DataTypes.TEXT,
      illustrationId: DataTypes.UUID,
      imageStatus: DataTypes.TEXT,
      printedName: DataTypes.TEXT,
      printedTypeLine: DataTypes.TEXT,
      purchaseUris: DataTypes.JSON,
      rarity: DataTypes.TEXT,
      releasedAt: DataTypes.DATE,
      setCode: DataTypes.TEXT,
      setId: DataTypes.UUID,
      setName: DataTypes.TEXT,
      legalities: DataTypes.JSON,
      hasFoil: DataTypes.BOOLEAN,
      hasEtched: DataTypes.BOOLEAN,
      hasNonFoil: DataTypes.BOOLEAN,
      hasGlossy: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Card',
      timestamps: false,
    },
  );
  return Card;
};
