'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.changeColumn('admin', 'id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      }),

      await queryInterface.addColumn('admin', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      }),

      await queryInterface.addColumn('admin', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      await queryInterface.addColumn('admin', 'isAdmin', {
        type: Sequelize.BOOLEAN,
      }),

    ])

  },

  async down(queryInterface, Sequelize) {
   
   await queryInterface.removeCloumn('admin','name');
   await queryInterface.removeCloumn('admin','email');
   await queryInterface.removeCloumn('admin','isAdmin');
     
  }
};
