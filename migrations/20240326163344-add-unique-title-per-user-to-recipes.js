'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Recipes', ['userId', 'title'], {
      unique: true,
      name: 'user_title_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Recipes', 'user_title_unique_constraint');
  }
};
