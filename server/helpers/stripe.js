const plaid = require('plaid')
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_KEY)
const axios = require('axios')
const { Artist } = require('../models/Artist')
const { Buyer } = require('../models/Buyer')
const omit = require('lodash/omit')
const uuidv1 = require('uuid/v1')

const createStripeCustomer = (tokenID) => {
  stripe.customers.create({
    source: tokenID,
    description: 'TOMMY JOHNNY'
  }, (err, customer) => {
    console.log('ERRRRRRRR""', err)
    console.log('CUSTOMERRRR:R', customer)
  })
}

const grabStripeToken = (req, res) => {
  const { accesToken, accountId } = req.body
  const plaidClient = new plaid.Client(
    process.env.REACT_APP_PLAID_CLIENT_ID,
    process.env.REACT_APP_PLAID_SECRET,
    process.env.REACT_APP_PLAID_PUBLIC_KEY,
    plaid.environments.sandbox)
  plaidClient.exchangePublicToken(accesToken, (exchangeError, exchangeRepsonse) => {
    const accessToken = exchangeRepsonse.access_token
    // Generate a bank account token
    plaidClient.createStripeToken(accessToken, accountId, (stripeTokenError, stripeTokenRepsonse) => {
      const bankAccountToken = stripeTokenRepsonse.stripe_bank_account_token
      if (!stripeTokenError) {
        res.json({
          status: 200,
          message: 'Successfullly exchanged Plaid token for bank account token',
          bankAccountToken
        })
        createStripeCustomer(bankAccountToken)
      }
    })
  })
}

const createStripeConnectAccount = (req, res) => {
  const { clientId, artistId } = req.body
  return axios ({
    method: 'POST',
    url: 'https://connect.stripe.com/oauth/token',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      client_secret: process.env.REACT_APP_STRIPE_KEY,
      grant_type: 'authorization_code',
      code: clientId
    }
  }).then(axiosResult => {
    const userIdFromStripe = axiosResult.data.stripe_user_id
    Artist.update(
      { stripeId: userIdFromStripe },
      { 
        returning: true,
        where: {
          artistId
        } 
      }
    ).then(([rowsUpdated, [artistWithStripId]]) => {
        res.json({
        status: 200,
        artist: omit(artistWithStripId.dataValues, ['password'])
      })
    })
  }).catch(e => console.log('ERROR WHEN CREATING WITH STRIPE:"', e))
}

const createChargeAndTransfer = (req, res) => {
  const { buyer, amount, seller } = req.body
  stripe.charges.create({
    amount: amount,
    currency: 'usd',
    customer: buyer,
    transfer_data: {
      destination: seller
    }
  }).then(function(charge) {
    console.log('STRIPE CHaRGE:', charge)
  }).catch(err => console.log('STRIPE CHARGE ERROR', err))
}

const retriveCustomerPaymentInfo = (req, res) => {
  const customerId = req.params.customerId
  stripe.customers.retrieve(
    customerId,
    (err, customer) => {
      if (customer){
      const defaultPaymentInfo = customer.sources.data
      res.json({
        status: 200,
        customerPaymentInfo: defaultPaymentInfo
      })
    }
    }
  )
}

const createStripeBuyer = async (req, res) => {
  const { token, userId, email } = req.body
  try {
    // create a buyer from the token created from stripe on front end
    await stripe.customers.create({
      source: token,
      email: email || null,
      description: userId
    }).then((buyer) => {
      const buyerPayload = {
        buyerId: uuidv1(),
        stripeToken: buyer.id,
        username: buyer.email
      }
      // if successful, send the new buyer info up to the FE
      Buyer.create(buyerPayload).then(buyerFromDb => {
        if (buyerFromDb) {
          res.status(200).json({
            status: 'success',
            message: 'Created New Buyer',
            buyer: buyerFromDb
          })
        }
      })
    })
  } catch (err) {
    res.status(500).end()
  }
}


module.exports = {
  createStripeConnectAccount,
  createChargeAndTransfer,
  createStripeBuyer,
  retriveCustomerPaymentInfo
}
