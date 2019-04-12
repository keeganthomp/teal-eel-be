const plaid = require('plaid')
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_KEY)
const axios = require('axios')
const { Artist } = require('../models/Artist')

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
    console.log('ERR:', exchangeError)
    const accessToken = exchangeRepsonse.access_token
    // Generate a bank account token
    plaidClient.createStripeToken(accessToken, accountId, (stripeTokenError, stripeTokenRepsonse) => {
      console.log('WOOOOO"', stripeTokenRepsonse)
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
        where: {
          artistId
        } 
      }
    )
  }).catch(e => console.log('ERROR WHEN CREATING WITH STRIPE:"', e))
}

const createChargeAndTransfer = (req, res) => {
  stripe.charges.create({
    amount: 100,
    currency: 'usd',
    source: 'tok_visa',
    transfer_data: {
      destination: 'acct_1EEefGFL7TQYKsIK'
    }
  }).then(function(charge) {
    console.log('STRIPE CHaRGE:', charge)
  })
}

const createStripeBuyer = async (req, res) => {
  const { token, userId } = req.body
  try {
    // create a buyer from the token created from stripe on front end
    const buyer = await stripe.customers.create({
      source: token,
      email: 'boujiboi@gmail.com'
    })
    // if successful, send the new buyer info up to the FE
    res.json({
      status: 200,
      buyer
    })
  } catch (err) {
    res.status(500).end()
  }
}


module.exports = {
  createStripeConnectAccount,
  createChargeAndTransfer,
  createStripeBuyer
}
