const omit = require('lodash/omit')
const { generateHash, validPassword } = require('../helpers/validation')
const { generateToken } = require('../helpers/utils')
const uuidv1 = require('uuid/v1')

// importing db model
const { Art } = require('../models/Art')
const { Artist } = require('../models/Artist')

const createArtist = (req, res) => {
  Object.keys(req.body).forEach(key => {
    !req.body[key] && delete req.body[key]
  })
  const payloadWithoutPassword = omit(req.body, ['password'])
  const payload = { 
    ...payloadWithoutPassword,
    artistId: uuidv1(),
    password: generateHash(req.body.password),
    art: []
  }
  Artist.create(payload).then(newArtist => {
    if (newArtist) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created New Artist'
        })
    } else {
      res.status(400).json({
        error: 'Looks like you are missing some fields'
      })
    }
  })
}

const getAllArtists = (req, res) => {
  Artist.findAll().then((data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL artists'
      })
  })
}

const getArtistLogin = (req, res) => {
  const { username, password } = req.body
  Artist.findOne({
    where: {
      username
    }
  }).then(artist => {
    if (artist && validPassword(password, artist.dataValues.password)) {
      const artistData = omit(artist.dataValues, ['password']) 
      req.session.user = artistData
      const token = generateToken(artistData)
      res.json({
        status: 200,
        artist: artistData,
        token
      })
    } else {
      res.status(400).json({
        error: 'Incorrect username or password'
      })
    }
  })
}

const getArtist = (req, res) => {
  Artist.findOne({
    where: {
      username: req.params.username
    }
  }).then(artist => {
    if (artist) {
      res.json({
        status: 200,
        artist: omit(artist.dataValues, ['password'])
      })
    } else {
      res.status(400).json({
        error: 'No Artist Found'
      })
    }
  })
}

const getArtistFromId = (req, res) => {
  Artist.findOne({
    where: {
      artistId: req.params.id
    }
  }).then(artist => {
    if (artist) {
      res.json({
        status: 200,
        artist: omit(artist.dataValues, ['password'])
      })
    } else {
      res.status(400).json({
        error: 'No Artist Found'
      })
    }
  })
}

const getArtistArt = (req, res) => {
  Art.findAll({
    where: {
      artistId: req.params.id
    }
  }).then(artistArt => {
    res.json({
      status: 200,
      art: artistArt
    })
  })
}

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin,
  getArtist,
  getArtistFromId,
  getArtistArt
}
