'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING(100)
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING(10)
      },
      total_price: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      idCustomer: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references:{
          model:'Users',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sales');
  }
};