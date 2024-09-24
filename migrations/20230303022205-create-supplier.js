'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        unique:true,
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      adress: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.BIGINT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};