const { DataTypes, Model } = require('sequelize');

class Password extends Model {
  static init(sequelize) {
    return super.init({
      PASSWORD_SEQ: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'PASSWORD_SEQ',
      },
      USER_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'USER_ID',
        references: {
          model: 'USR_USERS',
          key: 'USER_ID',
        },
      },
      PASSWORD: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'PASSWORD',
      },
      ACTIVE: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'ACTIVE',
      },
    }, {
      sequelize, // Pass the sequelize instance
      tableName: 'USR_PASSWORDS',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.USR_USERS, { foreignKey: 'USER_ID' });
  }
}

module.exports = Password;