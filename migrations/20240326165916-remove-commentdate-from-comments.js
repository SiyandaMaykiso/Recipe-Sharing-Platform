'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the commentDate column
    await queryInterface.removeColumn('Comments', 'commentDate');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the commentDate column back if the migration is rolled back
    await queryInterface.addColumn('Comments', 'commentDate', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  }
};
