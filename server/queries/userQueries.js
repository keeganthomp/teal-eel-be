
const { Buyer } = require('../models/Buyer')
const { Artist } = require('../models/Artist')
const omit = require('lodash/omit')
const { validPassword } = require('../helpers/validation')
const { generateToken } = require('../helpers/utils')

const getUserLogin = (req, res) => {
  const { username, password } = req.body
  Promise.all([
    Artist.findOne({
      where: {
        username
      }
    }), 
    Buyer.findOne({
      where: {
        username
      }
    })
  ]).then(data => {
    const artist = data[0]
    const buyer = data[1]
    // if there is an artist, verify the user in the artists table
    if (artist && validPassword(password, artist.dataValues.password)) {
      const artistData = omit(artist.dataValues, ['password']) 
      req.session.user = artistData
      const token = generateToken(artistData)
      res.json({
        status: 200,
        artist: artistData,
        token
      })
    // if there is a buyer, verify the user in the buyers table
    } else if (buyer && validPassword(password, buyer.dataValues.password)) {
      const buyerData = omit(buyer.dataValues, ['password']) 
      req.session.user = buyerData
      const token = generateToken(buyerData)
      res.json({
        status: 200,
        buyer: buyerData,
        token
      })
    // if there is not a record in either table, then the user does not exist
    } else {
      res.status(400).json({
        error: 'Incorrect username or password'
      })
    }
  }).catch(err => console.log('LOGIN ERROR', err))
}

module.exports = {
  getUserLogin
}