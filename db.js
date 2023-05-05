const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
  'plusultra_bot',
  'root',
  'root',
  {
    host: '77.223.106.141',
    port: '6432',
    dialect: 'postgres',
  }
)