const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardColorIdentity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  CardColorIdentity.init(
    {
      cardId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      color: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'CardColorIdentity',
    },
  );
  return CardColorIdentity;
};
