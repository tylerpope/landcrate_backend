const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardFinish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Card, { foreignKey: 'cardId' });
    }
  }
  CardFinish.init({
    cardId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    finish: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'CardFinish',
  });
  return CardFinish;
};
