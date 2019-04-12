const Sequelize = require('sequelize')
const { sequelize } = require('../database/Tart')

const Art = sequelize.define('artpieces', {
  artId: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  artistId: {
    type: Sequelize.UUID
  },
  description: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.FLOAT
  },
  artImage: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  bidStartTime: {
    type: Sequelize.INTEGER
  },
  closeTime: {
    type: Sequelize.INTEGER
  },
  buyerId: {
    type: Sequelize.UUID,
    allowNull: true
  }
})

module.exports = {
  Art
}