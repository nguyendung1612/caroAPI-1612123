const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'ObpppVvUW3',
  username: 'ObpppVvUW3',
  password: 'FU0l94EX64',
  port: 3306,
  dialect: 'mysql',
  host: 'remotemysql.com'
});

sequelize
  .authenticate()
  .then(() => console.log('Connected!'))
  .catch(err => console.log('Disconnected!'));

module.exports = sequelize;
