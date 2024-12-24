'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(30)
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING(200)
      },
      amount:{
        allowNull: false,
        type: DataTypes.INTEGER
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING(80)
      },
      images: {
        allowNull: true,
        type: DataTypes.STRING(350)
      },
      idCategory: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
          model:'Categories',
          key:'id'
        }
      },
      idSupplier:{
        allowNull: true,
        type: DataTypes.INTEGER,
        references:{
          model:'Suppliers',
          key:'id'
        },
        onDelete:'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};