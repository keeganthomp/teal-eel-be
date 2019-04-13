require('dotenv').config()
const Sequelize = require('sequelize')

const isProdution = process.env.NODE_ENV === 'production'
const productionDbConfig = process.env.DATABASE_URL
const dbUser = process.env.POSTGRES_USER
const dbPassword = process.env.POSTGRES_PASSWORD

console.log('IS PRODUCITON:', isProdution)

const sequelizeConfig = isProdution
  ? productionDbConfig
  : {
    database: 'tart',
    username: dbUser,
    password: dbPassword,
    dialect: 'postgres'
  }

const sequelize = new Sequelize(sequelizeConfig)

module.exports = {
  sequelize
}
