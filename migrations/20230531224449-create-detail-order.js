'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Detail_Orders', {
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
      idProduct: {
        allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "Products",
            key: "id",
          },
      },
      idOrder: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "Orders",
            key: "id",
          },
          onDelete:'CASCADE',
          onUpdate:'CASCADE'
        
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Detail_Orders');
  }
};