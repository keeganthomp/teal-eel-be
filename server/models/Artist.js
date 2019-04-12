const Sequelize = require('sequelize')
const { sequelize } = require('../database/Tart')

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
  first_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  specialty: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
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