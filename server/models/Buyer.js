const Sequelize = require('sequelize')
const { sequelize } = require('../database/Tart')

const Buyer = sequelize.define('buyers', {
  buyerId: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  stripeToken: {
    type: Sequelize.STRING
  }
})

module.exports = {
  Buyer
}