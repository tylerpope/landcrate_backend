const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Card, { foreignKey: 'cardId' });
      this.hasMany(models.CollectionCard, { foreignKey: 'priceId' });
    }
  }
  CardPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      cardId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CardPrice',
      timestamps: false,
    },
  );
  return CardPrice;
};
