const Sequelize = require('sequelize')
const { sequelize } = require('../database/Tart')

const Buyer = sequelize.define('buyers', {
  buyerId: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  stripeToken: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  }
})

module.exports = {
  Buyer
}