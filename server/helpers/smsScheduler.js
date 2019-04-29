const accountSid = process.env.REACT_APP_TWILIO_SID
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
const twilioClient = require('twilio')(accountSid, authToken)
const schedule = require('node-schedule')

const scheduleTextMessage = (req) => {
  const { phoneNumber, message, time } = req.body
  const sendTextMessage = () => {
    twilioClient.messages
      .create({
        body: message,
        from: `+${process.env.REACT_APP_TWILIO_PHONE_NUMBER}`,
        to: `${phoneNumber}`
      }).then(message => console.log('message sent:', message)).catch(err => console.log('ERROR SENDING TEXT', err))
  }
  sendTextMessage()
}

module.exports = {
  scheduleTextMessage
}
