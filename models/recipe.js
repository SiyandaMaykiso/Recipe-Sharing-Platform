'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Optional: specify an alias for when you join User to Recipe
        onDelete: 'CASCADE'
      });

      // If you plan to add Ingredients, Comments, and Ratings:
      Recipe.hasMany(models.Ingredient, {
        foreignKey: 'recipeId',
        as: 'ingredients', // Alias for when you join Recipe to Ingredients
        onDelete: 'CASCADE'
      });

      Recipe.hasMany(models.Comment, {
        foreignKey: 'recipeId',
        as: 'comments', // Alias for when you join Recipe to Comments
        onDelete: 'CASCADE'
      });

      Recipe.hasMany(models.Rating, {
        foreignKey: 'recipeId',
        as: 'ratings', // Alias for when you join Recipe to Ratings
        onDelete: 'CASCADE'
      });
    }
  }
  Recipe.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    creationDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};
