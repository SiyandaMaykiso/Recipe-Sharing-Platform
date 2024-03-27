'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate(models) {
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
      references: { model: 'recipes', key: 'id' }, // Ensure this matches your table name
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Name must not be empty" } },
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Quantity must not be empty" } },
    }
  }, {
    sequelize,
    modelName: 'Ingredient',
    tableName: 'ingredients', // Explicitly set the table name to 'ingredients'
    freezeTableName: true // Prevent Sequelize from altering the table name
  });
  return Ingredient;
};
