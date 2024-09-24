'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasOne(models.User,{
        foreignKey:'idRole'
      })
    }
  }
  Role.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull:false,
      unique: true,
      type: DataTypes.STRING(15)
    }
  }, {
    sequelize,
    modelName: 'Role',
    updatedAt:false,
    createdAt:false
  });
  return Role;
};