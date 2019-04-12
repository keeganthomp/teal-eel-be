// importing db models
const { Art } = require('../models/Art')
const { Artist } = require('../models/Artist')

const updateArt = (req, res) => {
  const updatedArtpiece = req.body
  Art.update(
    { ...updatedArtpiece },
    { returning: true, where: { artId: updatedArtpiece.artId } })
    .then(([rowsUpdated, [updatedArtpiece]]) => {
      res.json({
        status: 200,
        message: 'Successfully updated art',
        updatedArtpiece
      })
    })
}

const getAllArt = (req, res) => {
  Art.findAll().then(allArt => {
    res.json({
      status: 200,
      message: 'Successfully got all art',
      art: allArt
    })
  })
}

const getArtInfo = (req, res) => {
  const artId = req.params.id
  Art.findOne({
    where: {
      artId
    }
  }).then((artPiece) => {
    Artist.findOne({
      where: {
        artistId: artPiece.artistId
      }
    }).then(artist => {
      res.json({
        status: 200,
        message: 'Successfully retrieved art info',
        artPiece: {
          artist,
          artInfo: artPiece
        }
      })
    })
  })
}

module.exports = {
  updateArt,
  getAllArt,
  getArtInfo
}
