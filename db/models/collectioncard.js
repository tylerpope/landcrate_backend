const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CollectionCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Collection, { foreignKey: 'collectionId' });
      this.belongsTo(models.Card, { foreignKey: 'cardId' });
      this.belongsTo(models.CardPrice, { foreignKey: 'priceId', targetKey: 'id' });
    }
  }
  CollectionCard.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cardId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    priceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM('NM', 'SP', 'MP', 'HP'),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'CollectionCard',
  });
  return CollectionCard;
};
