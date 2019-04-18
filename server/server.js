require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const router = express.Router()
const app = express()
const https = require('https')
const http = require('http')
const jwt = require('jsonwebtoken')

const artistQueries = require('./queries/artistQueries')
const artQueries = require('./queries/artQueries')
const { fileUpload } = require('./helpers/upload')
const validation = require('./helpers/validation')
const { createStripeConnectAccount, createChargeAndTransfer, createStripeBuyer, retriveCustomerPaymentInfo } = require('./helpers/stripe')
const { scheduleTextMessage } = require('./helpers/smsScheduler')
const { httpsOptions } = require('./helpers/utils')

// importing db models
const { Art } = require('./models/Art')
const { Artist } = require('./models/Artist')
const { Buyer } = require('./models/Buyer')

const sessionSecret = process.env.SESSION_SECRET
const sessionKey = process.env.SESSION_KEY

const port = process.env.NODE_ENV === 'production'
  ? (process.env.PORT || 80)
  : 5000

// adding model associations and syncing DB tables
Art.belongsTo(Artist, {
  as: 'artist',
  foreignKey: 'artistId'
})
Buyer.hasMany(Art, {
  foreignKey: {
    name: 'buyerId',
    allowNull: true
  }
})

// Need to create these tables in this order due to how they are associated
Artist.sync().then(() => {
  Buyer.sync().then(() => {
    Art.sync()
  })
})

// requiring token to make any API call
app.use((req, res, next) => {
  const isSignupRoute = req.path === '/api/artist/signup'
  const isLoginRoute = req.path ==='/api/artist/login'
  const isOnHomePage = req.headers.referer === 'http://localhost:5300/' || `https://${'www.tealeel' || 'tealeel'}.com`
  // check header or url parameters or post parameters for token
  let token = req.headers['authorization']
  if (!token) return next() //if no token, continue
  token = token.replace('Bearer ', '')
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err && !isSignupRoute && !isLoginRoute && !isOnHomePage) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      })
    } else {
      //set the user to req so other routes can use it
      req.user = user 
      next()
    }
  })
})

app.use(session({
  key: sessionKey,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}))
// setting up CORS config
app.use((req, res, next) => {
  // websites allowed to connect to API
  const allowedOrigins = ['http://localhost:5300', 'https://www.tealeel.com']
  const origin = req.headers.origin
  const isOriginAllowed = allowedOrigins.includes(origin)
  if (isOriginAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization')
  // set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use( express.static( `${__dirname}/../build` ))
app.use(express.static(__dirname, { dotfiles: 'allow' } ))
app.get('/api/artists', artistQueries.getAllArtists)
app.get('/api/artist/:username', artistQueries.getArtist)
app.get('/api/artist/id/:id', artistQueries.getArtistFromId)
app.get('/api/art', artQueries.getAllArt)
app.get('/api/art/:id', artQueries.getArtInfo)
app.get('/api/artist/art/:id', artistQueries.getArtistArt)
app.get('/api/customer/payment/info/:customerId', retriveCustomerPaymentInfo)

app.post('/api/artist/signup', artistQueries.createArtist)
app.post('/api/artist/login', artistQueries.getArtistLogin)
app.post('/api/me/from/token', validation.verifyUser)
app.post('/api/logout', validation.logout)
app.post('/api/schedule/message', scheduleTextMessage)
// app.post('/api/get_stripe_token', grabStripeToken)
app.post('/api/create/stripe/account', createStripeConnectAccount)
app.post('/api/create/charge', createChargeAndTransfer)
app.post('/api/create/buyer', createStripeBuyer)

app.patch('/api/artist/:id', fileUpload)
app.patch('/api/update/art/:artId', artQueries.updateArt)

http.createServer(app).listen(port)
https.createServer(httpsOptions, app).listen(443)

module.exports = router
