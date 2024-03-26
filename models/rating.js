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
      references: { model: 'Recipes', key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Rating must be at least 1" },
        max: { args: [5], msg: "Rating cannot be more than 5" }
      }
    },
    ratingDate: DataTypes.DATE // Consider removing if not needed
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
