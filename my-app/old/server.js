require('dotenv').load()

const Twilio = require('twilio')
const chance = new require('chance')()
const express = require('express')
const app = express()

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
console.log(process.env);
app.get('/token', function (req, res) {
  const token = new AccessToken(
    process.env.REACT_APP_TWILIO_ACCOUNT_SID,
    process.env.REACT_APP_TWILIO_API_KEY,
    process.env.REACT_APP_TWILIO_API_SECRET,
  )

  token.identity = chance.name()
  token.addGrant(new ChatGrant({
    serviceSid: process.env.REACT_APP_TWILIO_CHAT_SERVICE_SID
  }))

  res.send({
    identity: token.identity,
    jwt: token.toJwt()
  })
})

app.listen(3001, function () {
  console.log('Programmable Chat token server listening on port 3001!')
})
