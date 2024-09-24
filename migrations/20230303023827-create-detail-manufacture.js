'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Detail_manufactures', {
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
        references:{
          model:'products',
          key:'id'
        }
      },
      idExpense: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references:{
          model:'expenses',
          key:'id'
        }
      },
      idManufacture: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
          model:'manufactures',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Detail_manufactures');  
  }
};