'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      Rating.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Optional: specify an alias for when you join Rating to User
        onDelete: 'CASCADE' // Ensures ratings are deleted if the user is deleted
      });
      Rating.belongsTo(models.Recipe, {
        foreignKey: 'recipeId',
        as: 'recipe', // Optional: specify an alias for when you join Rating to Recipe
        onDelete: 'CASCADE' // Ensures ratings are deleted if the recipe is deleted
      });
    }
  }
  Rating.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Recipes', // Note: Sequelize pluralizes the model name
        key: 'id',
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Note: Sequelize pluralizes the model name
        key: 'id',
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5 // Assuming ratings are on a 1-5 scale
      }
    },
    ratingDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
