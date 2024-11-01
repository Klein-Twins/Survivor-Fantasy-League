const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    return super.init({
      USER_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'USER_ID',
      },
      USER_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'USER_NAME',
      },
      USER_PROFILE_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'USER_PROFILE_ID',
      },
    }, {
      sequelize, // Pass the sequelize instance
      tableName: 'USR_USERS',
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.USR_PASSWORDS, { foreignKey: 'USER_ID' }); // Use model name as key
  }
}

module.exports = User;