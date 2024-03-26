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
      // Define association here
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
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures this field cannot be null
      validate: {
        notEmpty: { msg: "Title must not be empty" }, // Validates field is not an empty string
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false, // Ensures this field cannot be null
      validate: {
        notEmpty: { msg: "Description must not be empty" }, // Validates field is not an empty string
      }
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false, // Ensures this field cannot be null
      validate: {
        isDate: { msg: "Must be a valid date" }, // Validates field is a valid date
      }
    },
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};
