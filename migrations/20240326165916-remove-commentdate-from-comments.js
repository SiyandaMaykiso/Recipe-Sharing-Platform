'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Comments');
    if (tableDescription.commentDate) {
      await queryInterface.removeColumn('Comments', 'commentDate');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Add the commentDate column back if the migration is rolled back
    const tableDescription = await queryInterface.describeTable('Comments');
    if (!tableDescription.commentDate) {
      await queryInterface.addColumn('Comments', 'commentDate', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  }
};
