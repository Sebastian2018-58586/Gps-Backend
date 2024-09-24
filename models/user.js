"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    validPassword(password) {
      return bcrypt.compareSync(password,this.password);
    }

    static associate(models) {
      User.hasMany(models.Sale,{
        foreignKey:'idCustomer'
      });
      
      User.hasMany(models.Order,{
        foreignKey:'idCustomer'
      });

      User.hasMany(models.Manufacture,{
        foreignKey:'idEmployee'
      });
      User.belongsTo(models.Role,{
        foreignKey:'idRole',
      })
    }
  }
  User.init(
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
      surname:{
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(70),
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(150)
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING(80)
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.BIGINT(10),
      },
      adress: {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      idRole: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "User",
      createdAt:false,
      updatedAt:false,
      hooks:{
        beforeCreate:(user)=>{
          if(user.password){
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate:(user)=>{
          if(user.password){
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        }
      }
    }
  );
  
  return User;
};
