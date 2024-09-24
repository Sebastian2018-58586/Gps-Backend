'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manufacture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Manufacture.hasMany(models.Detail_manufacture,{
        foreignKey:'idManufacture',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Manufacture.belongsTo(models.User, {
        foreignKey: "idEmployee",
        /* target_key: "idCustomer", */
      });
    }
  }
  Manufacture.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      unique:true,
      type: DataTypes.STRING(80)
    },
    idEmployee: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references:{
        model:'users',
        key:'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function () {
        return this.getDataValue("createdAt").toLocaleString("en-US");
      },
    },
  }, {
    sequelize,
    modelName: 'Manufacture',
    createdAt:true,
    updatedAt:false
  });
  return Manufacture;
};