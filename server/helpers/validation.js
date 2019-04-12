const bcrypt = require('bcrypt-nodejs')
const { Artist } = require('../models/Artist')
const jwt = require('jsonwebtoken')

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (unhashedPassword, hashedPassword) => {
  return bcrypt.compareSync(unhashedPassword, hashedPassword)
}

const verifyUser = (req, res) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token
  if (!token) {
    return res.status(401).json({message: 'Must pass token'})
  }
  // Check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) throw err

    //return user using the id from w/in JWTToken
    const artist = await Artist.findByPk(user.id)
    res.json(artist)
  })
}

const logout = (req, res) => {
  req.session.destroy()
}

module.exports = {
  generateHash,
  validPassword,
  verifyUser,
  logout
}
