"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail_sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Detail_sale.belongsTo(models.Sale, {
        foreignKey: "idSale",
       /*  target_key: "idSale", */
      });
      Detail_sale.belongsTo(models.Product, {
        foreignKey: "idProduct",
        /* target_key: "idProduct", */
      });
    }
  }
  Detail_sale.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        allowNull: false,
        type: DataTypes.SMALLINT,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      idProduct: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      idSale: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Detail_sale",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Detail_sale;
};
