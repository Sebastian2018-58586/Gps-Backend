"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.Product, {
        foreignKey: "idSupplier",
        onDelete: "CASCADE",
      });
    }
  }
  Supplier.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      adress: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "Supplier",
      updatedAt: false,
      createdAt: false,
    }
  );
  return Supplier;
};
