const db = require('../utils/db');
const Sequelize = require('sequelize');

const User = db.define('user', {
  name: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING }
});

const Facebook = db.define('facebook', {
  code: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING }
});

User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('Did you enter wrong database credentials?'));

Facebook.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('Did you enter wrong database credentials?'));

module.exports = {
  createUser: async ({ name, username, password, avatar }) => {
    return await User.create({ name, username, password, avatar });
  },

  getAllUsers: async () => {
    return await User.findAll();
  },

  getUser: async obj => {
    return await User.findOne({
      where: obj
    });
  },

  createUserFB: async ({ code, name, email }) => {
    return await Facebook.create({ code, name, email });
  },

  getUserFB: async obj => {
    return await Facebook.findOne({
      where: obj
    });
  },

  updateDataLocal: async (values, options) => {
    return await User.update(values, options);
  },

  updateDataFacebook: async (entity, id) => {
    return await Facebook.update({ entity, where: id });
  },

  nextID: async tableName => {
    var sql = `SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'ObpppVvUW3' AND TABLE_NAME = '${tableName}'`;
    return await db.query(sql, {
      type: Sequelize.QueryTypes.SELECT
    });
  }
};
