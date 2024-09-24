'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product,{
        foreignKey:'idCategory'
      })
    }
  }
  Category.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      unique:true,
      type: DataTypes.STRING(30)
    }
    
  }, {
    sequelize,
    modelName: 'Category',
    createdAt:false,
    updatedAt:false
  });
  return Category;
};