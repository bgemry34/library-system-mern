const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt_decode = require('jwt-decode')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({ username: body.username })
  const userType = req.body.userType
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }
  if (!userType) {
    return res.status(401).json({
      error: 'Please select a user type',
    })
  }
  if (userType !== user.userType) {
    return res.status(401).json({
      error: `You are not a ${userType}`,
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    userType: user.userType,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  return res.status(200).send({
    token,
    username: user.username,
    name: user.name,
    userType: user.userType,
  })
})

loginRouter.post('/me/:token', async (req, res) => {
  const token = req.params.token
  try {
    const decoded = await jwt_decode(token)

    const user = await User.findOne({ _id: decoded.id })

    if (user) {
      const { username, userType } = user
      return res.json({
        username,
        userType,
        id:decoded.id
      })
    } else {
      return res.status(401).json({
        error: 'invalid token',
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(401).json({
      error: 'invalid token',
    })
  }
  //   .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
