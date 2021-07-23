"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Questions", "tag", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Questions", "tag", {
        type: Sequelize.STRING,
      }),
    ]);
  },
};
