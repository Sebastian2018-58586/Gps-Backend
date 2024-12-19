"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("Detail_sales", {
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
        references: {
          model: "Products",
          key: "id",
        }
      },
      idSale: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Sales",
          key: "id",
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Detail_sales");
  },
};
