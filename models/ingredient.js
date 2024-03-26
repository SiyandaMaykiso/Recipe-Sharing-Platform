'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredient.belongsTo(models.Recipe, {
        foreignKey: 'recipeId', // Ensure this matches the foreign key in the database
        as: 'recipe', // Optional: specify an alias for when you join Ingredient to Recipe
        onDelete: 'CASCADE' // If a Recipe is deleted, its Ingredients are also deleted
      });
    }
  }
  Ingredient.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Recipes', // Note: The model name 'Recipe' is usually pluralized by Sequelize
        key: 'id',
      }
    },
    name: DataTypes.STRING,
    quantity: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};
