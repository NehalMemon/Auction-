'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * */
    return Promise.all([
      await queryInterface.changeColumn('players', 'id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }),
      await queryInterface.addColumn('players', 'name', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn('players', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      await queryInterface.addColumn('players', 'playingStyle', {
        type: Sequelize.ENUM(['right-handed', 'left-handed']),
        allowNull: false,
        defaultValue: 'right-handed'
      }),
      await queryInterface.addColumn('players', 'category', {
        type: Sequelize.ENUM('Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper-batsman'),
        allowNull: false,
        defaultValue: 'Batsman'
      }),
      await queryInterface.addColumn('players', 'battingOrder', {
        type: Sequelize.ENUM('Top-order', 'Middle-order', 'Lower-order'),
        allowNull: true,
        defaultValue: 'Top-order'
      }),
      await queryInterface.addColumn('players', 'bowlingType', {
        type: Sequelize.ENUM('Fast', 'Medium', 'Spin'),
        allowNull: true,
        defaultValue: 'Fast'
      }),
      await queryInterface.addColumn('players', 'teamId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn('players', 'isSold', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }),
      await queryInterface.addColumn('players', 'soldPrice', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      await queryInterface.addColumn('players', 'auctionCategory', {
        type: Sequelize.ENUM('Platinum', 'Diamond', 'Gold', 'Silver'),
        allowNull: true,
        defaultValue: 'Silver'
      }),
      await queryInterface.addColumn('players', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW') // Sets current time for existing rows
      }),
      await queryInterface.addColumn('players', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }),
      await queryInterface.addColumn('players', 'deletedAt', {
        allowNull: true,
        type: Sequelize.DATE // Required for Soft Delete
      })
    ])
  },

async down(queryInterface, Sequelize) {
    /**
     * Revert all changes
     */
    return Promise.all([
      queryInterface.removeColumn('players', 'phoneNumber'),
      queryInterface.removeColumn('players', 'playerImage'),
      queryInterface.removeColumn('players', 'playingStyle'),
      queryInterface.removeColumn('players', 'category'),
      queryInterface.removeColumn('players', 'battingOrder'),
      queryInterface.removeColumn('players', 'bowlingType'),
      queryInterface.removeColumn('players', 'teamId'),
      queryInterface.removeColumn('players', 'isSold'),
      queryInterface.removeColumn('players', 'soldPrice'),
      queryInterface.removeColumn('players', 'auctionCategory'),
      queryInterface.removeColumn('players', 'createdAt'),
      queryInterface.removeColumn('players', 'updatedAt'),
      queryInterface.removeColumn('players', 'deletedAt')
    ]);
  }
};

