'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A user can have many recipes
      User.hasMany(models.Recipe, {
        foreignKey: 'userId',
        as: 'recipes', // This alias is optional but helpful for readability
        onDelete: 'CASCADE', // Ensures user deletion cascades to recipes
      });

      // A user can have many comments
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments', // This alias is optional but helpful for readability
        onDelete: 'CASCADE', // Ensures user deletion cascades to comments
      });

      // A user can have many ratings
      User.hasMany(models.Rating, {
        foreignKey: 'userId',
        as: 'ratings', // This alias is optional but helpful for readability
        onDelete: 'CASCADE', // Ensures user deletion cascades to ratings
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This username is already taken.'
      },
      validate: {
        notNull: { msg: "Username is required" },
        notEmpty: { msg: "Username must not be empty" },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This email is already in use.'
      },
      validate: {
        isEmail: { msg: "Must be a valid email address" },
        notNull: { msg: "Email is required" },
        notEmpty: { msg: "Email must not be empty" },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        notEmpty: { msg: "Password must not be empty" },
        len: {
          args: [7, 42],
          msg: "Password must be between 7 and 42 characters long",
        },
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
