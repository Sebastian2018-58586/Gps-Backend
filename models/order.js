'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.Detail_Order,{
        foreignKey:'idOrder'
      });
      Order.belongsTo(models.User,{
        foreignKey:'idCustomer'
      });
    }
  }
  Order.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    total_price: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    idCustomer: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get:function(){
        return this.getDataValue('createdAt').toLocaleString('en-Us');
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
    createdAt:true,
    updatedAt:false,
  });
  return Order;
};