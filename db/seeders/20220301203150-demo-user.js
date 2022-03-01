'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: 'bronson',
        email: 'tylerpopee@gmail.com',
        password: '$2a$10$zaddrjIeOX/SeJNUJsz0ueBOdscJRsLqCu6eeyljmIPEhBj3nNjpe',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
