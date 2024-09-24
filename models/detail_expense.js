'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_expense extends Model {
    
    static associate(models) {
      Detail_expense.belongsTo(models.Expense,{
        foreignKey:'idExpense'
      });
      Detail_expense.belongsTo(models.Product,{
        foreignKey:'idProduct'
      });
    }
  }
  Detail_expense.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    amount: {
      allowNull: false,
      type: DataTypes.SMALLINT
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    use: {
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    idProduct: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    idExpense: {
      allowNull: false,
      type: DataTypes.INTEGER,
      
    }
  }, {
    sequelize,
    modelName: 'Detail_expense',
    createdAt:false,
    updatedAt:false
  });
  return Detail_expense;
};