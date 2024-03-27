'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
      Rating.belongsTo(models.Recipe, {
        foreignKey: 'recipeId',
        as: 'recipe',
        onDelete: 'CASCADE'
      });
    }
  }
  Rating.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'recipes', key: 'id' }, // Ensure this matches your table name
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }, // Ensure this matches your table name
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Rating must be at least 1" },
        max: { args: [5], msg: "Rating cannot be more than 5" }
      }
    },
    ratingDate: DataTypes.DATE // Consider if this column is necessary, or if Sequelize's createdAt could be used
  }, {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings', // Explicitly set the table name to 'ratings'
    freezeTableName: true // Prevent Sequelize from altering the table name
  });
  return Rating;
};
