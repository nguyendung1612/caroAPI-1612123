const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'Caro',
  username: 'root',
  password: '07071012',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Connected!'))
  .catch(err => console.log('Disconnected!'));

module.exports = sequelize;
