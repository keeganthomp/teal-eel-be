const Sequelize = require('sequelize')

let sequelize = new Sequelize('tart', 'keegan', 'hu8jmn3', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

module.exports = {
  sequelize
}