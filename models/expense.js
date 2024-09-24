"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Expense.hasMany(models.Detail_expense, {
        foreignKey: "idExpense",
      });
      Expense.hasMany(models.Detail_manufacture, {
        foreignKey: "idExpense",
      });
    }
  }
  Expense.init(
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
      total_price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get: function () {
          return this.getDataValue("createdAt").toLocaleString("en-US");
        },
      },
    },
    {
      sequelize,
      modelName: "Expense",
      createdAt: true,
      updatedAt: false,
    }
  );
  return Expense;
};
