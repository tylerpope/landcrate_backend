'use strict';
const {
  Model
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
    }
  }
  CollectionCard.init({
    cardId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    priceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("FOIL", "NON-FOIL", "ETCHED"),
    },
  }, {
    sequelize,
    modelName: 'CollectionCard',
  });
  return CollectionCard;
};