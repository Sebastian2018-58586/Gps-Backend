"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.Detail_sale,{
        foreignKey:'idProduct'
      });
      Product.hasMany(models.Detail_Order,{
        foreignKey:'idProduct'
      });
      Product.hasMany(models.Detail_expense,{
        foreignKey:'idProduct'
      });
      Product.belongsTo(models.Category,{
        foreignKey:'idCategory'
      });
      Product.belongsTo(models.Supplier,{
        foreignKey:'idSupplier'
      });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING(200),
      },
      amount:{
        allowNull: false,
        type: DataTypes.INTEGER
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      images: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      idCategory: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      idSupplier:{
        allowNull: true,
        type: DataTypes.INTEGER,
      }
    },
    {
      sequelize,
      modelName: "Product",
      updatedAt:false,
      createdAt:false
    }
  );
  return Product;
};
