"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CardColorIdentity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Card, { foreignKey: "cardId" });
    }
  }
  CardColorIdentity.init(
    {
      cardId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
      },
      color: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "CardColorIdentity",
    }
  );
  return CardColorIdentity;
};
