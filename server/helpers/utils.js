require('dotenv').config()
const jwt = require('jsonwebtoken')
const fs = require('fs')

const generateToken = (artist) => {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the     
  //app/collections/models
  const u = {
    id: artist.artistId.toString(),
    username: artist.username,
    firstName: artist.first_name,
    lastName: artist.last_name,
    specialty: artist.specialty,
    location: artist.location,
    age: artist.age,
    avatar: artist.avatar,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString()
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