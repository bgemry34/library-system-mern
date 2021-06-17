const bcrypt = require('bcrypt')
const app = require('../app')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET all users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  return res.json(users)
})

// GET specific user
usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  return res.json(user)
})

// CREATE new user
usersRouter.post('/', async (req, res) => {
  const body = req.body
  const password = body.password

  if (!password || password.length < 3) {
    return res
      .status(400)
      .send({ error: 'password must be at least 3 characters long' }).end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    userType: body.userType,
    dateCreated: new Date().toISOString(),
  })

  const savedUser = await user.save()
  return savedUser ? res.json(savedUser) : res.status(400).end()
})

module.exports = usersRouter
