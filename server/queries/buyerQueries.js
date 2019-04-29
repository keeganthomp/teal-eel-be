const { Buyer } = require('../models/Buyer')
const uuidv1 = require('uuid/v1')
const omit = require('lodash/omit')
const { generateHash, validPassword } = require('../helpers/validation')

const createBuyer = (req, res) => {
  Object.keys(req.body).forEach(key => {
    !req.body[key] && delete req.body[key]
  })
  const payloadWithoutPassword = omit(req.body, ['password'])
  const payload = { 
    ...payloadWithoutPassword,
    buyerId: uuidv1(),
    password: generateHash(req.body.password)
  }
  Buyer.create(payload).then(newBuyer => {
    if (newBuyer) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created New Buyer'
        })
    } else {
      res.status(400).json({
        error: 'Looks like you are missing some fields'
      })
    }
  })
}

module.exports = {
  createBuyer
}