const { Sequelize } = require('sequelize');
const path = require('path');

// 创建 Sequelize 实例，使用 SQLite 数据库
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite')
});

module.exports = sequelize;