'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Users', {
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
      surname:{
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(60)
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(150)
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.BIGINT(10)             
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING(80)
      },
      adress: {
        allowNull: false,
        type: DataTypes.STRING(30)
      },
      idRole: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
          model:'Roles',
          key:'id'
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};