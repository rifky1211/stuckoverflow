'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeSave((user, options) => {

    return bcrypt.hash(user.password, saltRounds)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw err;
        });
});

User.prototype.validatePassword = function (password, callback) {
  console.log("kepanggil")
  bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err)  return callback(err); 

      callback(null, isMatch);
  });
};

  return User;
};