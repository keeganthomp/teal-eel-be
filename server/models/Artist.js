const Sequelize = require('sequelize')
const { sequelize } = require('../database/Tart')

// model for artists
const Artist = sequelize.define('artist', {
  artistId: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5,17]
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  location: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  stripeId: {
    type: Sequelize.STRING
  }
})


module.exports = {
  Artist
}