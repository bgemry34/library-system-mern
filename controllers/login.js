const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt_decode = require('jwt-decode')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({ username: body.username })

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    userType: user.userType,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  // console.log('decoded token:', await jwt_decode(token))

  return res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
      userType: user.userType,
    })
})

module.exports = loginRouter
