"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CardColor extends Model {
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
  CardColor.init(
    {
      cardId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      color: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "CardColor",
      timestamps: false,
    }
  );
  return CardColor;
};
