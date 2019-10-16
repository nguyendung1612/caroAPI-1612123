const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'caro_dung',
  username: 'yan',
  port: 3306,
  dialect: 'mysql',
  host: '112.197.2.178'
});

sequelize
  .authenticate()
  .then(() => console.log('Connected!'))
  .catch(err => console.log('Disconnected!'));

module.exports = sequelize;
