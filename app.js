const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const booksRouter = require('./controllers/books')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const borrowRouter = require('./controllers/borrow')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info('connected to the database'))
  .catch((e) => logger.error('error connecting to database:', e))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/books', booksRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/borrow', borrowRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
