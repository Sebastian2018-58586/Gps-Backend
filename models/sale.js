"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.hasMany(models.Detail_sale, {
        foreignKey: "idSale",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Sale.belongsTo(models.User, {
        foreignKey: "idCustomer",
        /* target_key: "idCustomer", */
      });
    }
  }
  Sale.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(100),
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      total_price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      idCustomer: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        get:function(){
          return this.getDataValue('createdAt').toLocaleString('en-US');
        }
      },
      
    },
    {
      sequelize,
      modelName: "Sale",
      updatedAt:false,
      createdAt:true
    }
  );
  return Sale;
};
