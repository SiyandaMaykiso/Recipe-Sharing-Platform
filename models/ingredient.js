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
      // Define association here
      Ingredient.belongsTo(models.Recipe, {
        foreignKey: 'recipeId',
        as: 'recipe',
        onDelete: 'CASCADE'
      });
    }
  }
  Ingredient.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'id',
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures this field cannot be null
      validate: {
        notEmpty: { msg: "Name must not be empty" }, // Validates field is not an empty string
      }
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures this field cannot be null
      validate: {
        notEmpty: { msg: "Quantity must not be empty" }, // Validates field is not an empty string
      }
    }
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};
