const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Set extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Card, { foreignKey: 'setId' });
    }
  }
  Set.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    code: DataTypes.STRING,
    parentSetCode: DataTypes.STRING,
    setType: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Set',
  });
  return Set;
};
