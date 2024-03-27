'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipe.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });

      Recipe.hasMany(models.Ingredient, {
        foreignKey: 'recipeId',
        as: 'ingredients',
        onDelete: 'CASCADE'
      });

      Recipe.hasMany(models.Comment, {
        foreignKey: 'recipeId',
        as: 'comments',
        onDelete: 'CASCADE'
      });

      Recipe.hasMany(models.Rating, {
        foreignKey: 'recipeId',
        as: 'ratings',
        onDelete: 'CASCADE'
      });
    }
  }

  Recipe.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // This should match exactly the table name in lowercase
        key: 'id',
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title must not be empty" },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description must not be empty" },
      }
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Must be a valid date" },
      }
    },
  }, {
    sequelize,
    modelName: 'Recipe',
    tableName: 'recipes', // Explicitly specify the table name here
    freezeTableName: true, // Prevent Sequelize from automatically pluralizing the table name
  });

  return Recipe;
};
