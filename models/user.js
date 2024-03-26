'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associations can be defined here
      User.hasMany(models.Recipe, { foreignKey: 'userId', as: 'recipes', onDelete: 'CASCADE' });
      User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
      User.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username must not be empty" },
        // Custom validator for username
        isValidUsername(value) {
          const prohibitedPattern = /[^a-zA-Z0-9]+/; // Example: Disallow special characters
          if (prohibitedPattern.test(value)) {
            throw new Error('Username must only contain letters and numbers');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email address" },
        notEmpty: { msg: "Email must not be empty" },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password must not be empty" },
        // Custom validator for password complexity
        isComplexEnough(value) {
          const hasNumber = /\d/;
          const hasSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/;
          if (!hasNumber.test(value) || !hasSpecialChar.test(value)) {
            throw new Error('Password must include at least one number and one special character');
          }
        },
        len: {
          args: [8, 100], // Adjusted to enforce minimum length of 8 characters
          msg: "Password must be at least 8 characters long",
        },
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  // Hooks for password hashing
  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
