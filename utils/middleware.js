const jwt = require('jsonwebtoken')
require('dotenv')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: 'invalid user' })
  }
  req.user = user
  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  logger.error(error.data)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    if (error.message.includes('User validation failed')) {
      if (error.message.includes('unique')) {
        return res.status(400).json({ error: 'username already exists' })
      } else if (error.message.includes('`username` is required.')) {
        return res.status(400).json({ error: 'username is required' })
      } else if (error.message.includes('`userType` is required.')) {
        return res.status(400).json({ error: 'user Type is required' })
      } else if (error.message.includes('`password` is required.')) {
        return res.status(400).json({ error: 'password is required' })
      } else {
        return res.status(400).json({ error: error.message })
      }
    }
    if (error.message.includes('Book validation failed')) {
      if (error.message.includes('expected `title` to be unique')) {
        return res.status(400).json({ error: 'title must be unique' })
      } else if (error.message.includes('author')) {
        return res.status(400).json({ error: 'Author should be included' })
      } else {
        return res.status(400).json({ error: error.message })
      }
    }
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  } else if (error.message) {
    return res.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
