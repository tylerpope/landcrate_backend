module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      email: 'tylerpopee@gmail.com',
      password: '$2a$10$zaddrjIeOX/SeJNUJsz0ueBOdscJRsLqCu6eeyljmIPEhBj3nNjpe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
