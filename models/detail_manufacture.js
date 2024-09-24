'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_manufacture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Detail_manufacture.belongsTo(models.Manufacture,{
        foreignKey:'idManufacture'
      });
      Detail_manufacture.belongsTo(models.Product,{
        foreignKey:'idProduct'
      });
      Detail_manufacture.belongsTo(models.Expense,{
        foreignKey:'idExpense'
      });
    }
  }
  Detail_manufacture.init({
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
    amountLost: {
      allowNull: true,
      type: DataTypes.SMALLINT
    },
    category:{
      allowNull: false,
      type: DataTypes.STRING(40)
    },
    idProduct: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    idExpense: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    idManufacture: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Detail_manufacture',
    createdAt:false,
    updatedAt:false
  });
  return Detail_manufacture;
};