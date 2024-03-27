'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
      Comment.belongsTo(models.Recipe, {
        foreignKey: 'recipeId',
        as: 'recipe',
        onDelete: 'CASCADE'
      });
    }
  }
  Comment.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'recipes', key: 'id' }, // Adjust the model reference to lowercase
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }, // Adjust the model reference to lowercase
    },
    commentText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: "Comment text must not be empty" } },
    }
    // Removed the commentDate field to rely on Sequelize's `createdAt`
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments', // Explicitly specify the table name to be 'comments'
    freezeTableName: true // Prevents Sequelize from altering the table name
  });
  return Comment;
};
