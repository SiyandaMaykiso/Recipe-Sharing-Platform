'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Optional: specify an alias for easier querying
        onDelete: 'CASCADE' // Ensures comments are deleted if the user is deleted
      });
      Comment.belongsTo(models.Recipe, {
        foreignKey: 'recipeId',
        as: 'recipe', // Optional: specify an alias for easier querying
        onDelete: 'CASCADE' // Ensures comments are deleted if the recipe is deleted
      });
    }
  }
  Comment.init({
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
    commentText: DataTypes.TEXT,
    commentDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
