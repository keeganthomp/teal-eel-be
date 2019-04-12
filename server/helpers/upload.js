const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')
const s3 = new AWS.S3()

// importing db models
const { Art } = require('../models/Art')
const { Artist } = require('../models/Artist')

// config for AWS s3 bucket
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  'region': 'sa-east-1'
})

const uploadToS3 = (props) => {
  const { base64encodedImage, fileName, bucket, res, userId } = props
  const myBucket = bucket
  const imageForDisk = base64encodedImage.split(';base64,').pop()
  const  tempDirectory = __dirname + '/temp'
  if (!fs.existsSync(tempDirectory)){
    fs.mkdirSync(tempDirectory)
  }
  fs.writeFile(path.join(__dirname + `/temp/${fileName}`), imageForDisk, { encoding: 'base64' }, (err) => {
    err && console.log('ERROR WRITING FILE:', err)
  })
  setTimeout(() => {
    s3.createBucket({ Bucket: myBucket }, (err) => {
      // image names cannot have '+' signs in the file name
      const imageToUpload = fs.createReadStream(path.join(__dirname + `/temp/${fileName}`))
      if (err && (err.code !== 'BucketAlreadyOwnedByYou' || err.BucketAlreadyOwnedByYou)) {
        res.status(400).json({
          error: 'Unable to upload image'
        })
      } else {
        const params = { 
          Bucket: myBucket,
          Key: fileName,
          Body: imageToUpload,
          ContentEncoding: 'base64',
          type: 'image/jpeg',
          region: 'us-east-1'
        }
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('ERRRR:', err)
            res.status(400).json({
              error: 'Unable to upload image'
            })
          } else {
            if (bucket === 'artist-profile-images' ) {
              Artist.update(
                { avatar: `https://s3.amazonaws.com/${bucket}/${data.key || data.Key}` },
                { returning: true, where: { artistId: userId } }
              ).then(([rowsUpdated, [artistWithUpdatedProfilePicture]]) => {
                if (artistWithUpdatedProfilePicture) {
                  res.json({
                    status: 200,
                    message: 'Successfully updated profile image',
                    updatedProfileImage: artistWithUpdatedProfilePicture.avatar
                  })
                } else {
                  res.status(400).json({
                    error: 'UNABLE TO UPDATE ARTIST PROFILE'
                  })
                }
              })
            } else {
              const artPiece = JSON.stringify({
                artId: uuidv1(),
                price: 6.66,
                description: 'Some description about the art',
                artImage: `https://s3.amazonaws.com/${bucket}/${data.key || data.Key}`,
                type: 'painting'
              })
              Art.create(JSON.parse(artPiece)).then(addedArtpiece => {
                Artist.findOne({
                  where: {
                    artistId: userId
                  }
                }).then(artist => {
                  addedArtpiece.setArtist(artist.artistId)
                  res.json({
                    status: 200,
                    message: 'Successfully added art to art image',
                    artpiece: addedArtpiece
                  })
                })
              })
            }
          }
        })
      }
    }).on('httpUploadProgress', progress => {
      console.log(progress.loaded + ' of ' + progress.total + ' bytes')
    })
  },2000)
}

const fileUpload = (req, res) => {
  const { isProfilePicture, base64encodedImage, fileName, price, description, image } = req.body
  if (isProfilePicture) {
    uploadToS3({
      base64encodedImage: base64encodedImage,
      fileName,
      bucket: 'artist-profile-images',
      res,
      userId: req.params.id 
    })
  } else {
    uploadToS3({
      base64encodedImage: base64encodedImage,
      fileName,
      bucket: 'artist-portfolio-images',
      res,
      userId: req.params.id,
      price,
      description,
      image
    }) 
  }
}

module.exports = {
  fileUpload
}