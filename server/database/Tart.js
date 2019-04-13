const Sequelize = require('sequelize')
var database = process.env.DATABASE_URL || 'tart'
console.log('DATABASEE:', database)


const sequelize = new Sequelize(database)

module.exports = {
  sequelize
}