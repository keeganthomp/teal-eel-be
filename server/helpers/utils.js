require('dotenv').config()
const jwt = require('jsonwebtoken')
const fs = require('fs')

const generateToken = (user) => {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the 
  const userId = user.artistId || user.buyerId
  const u = {
    id: userId.toString(),
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    specialty: user.specialty,
    location: user.location,
    age: user.age,
    avatar: user.avatar,
    createdAt: user.createdAt.toString(),
    updatedAt: user.updatedAt.toString()
  }
  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}

const httpsOptions = {
  key: fs.existsSync(__dirname + '/../../privkey.pem') ? fs.readFileSync(__dirname + '/../../privkey.pem') : '',
  cert: fs.existsSync(__dirname + '/../../cert.pem') ? fs.readFileSync(__dirname + '/../../cert.pem') : '',
  ca: fs.existsSync(__dirname + '/../../chain.pem.pem') ? fs.readFileSync(__dirname + '/../../chain.pem.pem') : ''
}

module.exports = {
  generateToken,
  httpsOptions
}