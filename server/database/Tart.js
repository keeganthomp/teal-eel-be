const Sequelize = require('sequelize')
var database = process.env.DATABASE_URL || 'tart'

const sequelize = new Sequelize(database, 'postgres', '', {
  dialect: 'postgres'
})

module.exports = {
  sequelize
}