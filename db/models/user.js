const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(32),
        unique: true,
        allowNull: false,
      },
      password: DataTypes.STRING(32),
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeSave: async (user) => {
          // eslint-disable-next-line no-param-reassign
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
    },
  );

  // eslint-disable-next-line func-names
  User.prototype.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
  };

  return User;
};
