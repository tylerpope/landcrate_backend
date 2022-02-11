"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCard extends Model {
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
  UserCard.init(
    {
      cardId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      userId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      priceId: DataTypes.INTEGER,
      type: {
        type: DataTypes.ENUM("FOIL", "NON-FOIL", "ETCHED"),
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "UserCard",
    }
  );
  return UserCard;
};
