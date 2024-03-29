// models/index.js
const User = require('./user');
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');
const Comment = require('./comment');
const Rating = require('./rating');

module.exports = {
  User,
  Recipe,
  Ingredient,
  Comment,
  Rating,
  // any shared utilities or common functions can also be exported here
};
