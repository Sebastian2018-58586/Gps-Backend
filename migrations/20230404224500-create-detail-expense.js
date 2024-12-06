'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Detail_expenses', {
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
        references:{
          model:'Products',
          key:'id'
        }
      },
      idExpense: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
          model:'Expenses',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Detail_expenses');
  }
};