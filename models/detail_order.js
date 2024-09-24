'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Detail_Order.belongsTo(models.Order,{
        foreignKey:'idOrder'
      });
      Detail_Order.belongsTo(models.Product,{
        foreignKey:'idProduct'
      });
    }
  }
  Detail_Order.init({
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
    idProduct: {
      allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "products",
          key: "id",
        },
    },
    idOrder: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      
    }
  }, {
    sequelize,
    modelName: 'Detail_Order',
    createdAt:false,
    updatedAt:false
  });
  return Detail_Order;
};