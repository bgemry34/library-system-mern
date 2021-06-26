const reservationRouter = require('express').Router()
const Reserve = require('../models/reserve')
const User = require('../models/user')
const Book = require('../models/book')
const moment = require('moment')

const userIsAdmin = (next, user) => {
  return (
    user.userType === 'admin' ||
    next(new Error('You are not allowed to approve a reservation request'))
  )
}

const validReserveStatus = (next, currentStatus, expectedStatus) => {
  return (
    currentStatus === expectedStatus ||
    next(new Error(`Reservation request has been ${currentStatus}`))
  )
}

// GET all reservation data
reservationRouter.get('/', async (req, res) => {
  const reserveList = await Reserve.find({}).populate('user', {
    name: 1,
    username: 1,
  })
  return res.json(reserveList)
})

const isValidDate = (date) => {
  return moment(date).isAfter(moment(new Date()).format, 'day')
}

//CREATE a new reservation request
//req.body = { bookId, reservationDate }
// reservationDate = "MM/DD/YYYY"
reservationRouter.post('/', async (req, res, next) => {
  const user = req.user
  const body = req.body
  const bookData = await Book.findById(body.bookId)
  const reservationDate =
    moment(new Date(body.reservationDate)).format ||
    next(new Error('Invalid date'))

  console.log(body)
  if (!body.bookId) {
    return next(new Error('You must provide a book id to borrow'))
  } else if (!bookData) {
    return next(new Error('Invalid book'))
  }

  console.log(reservationDate, isValidDate(reservationDate))
  return
})

module.exports = reservationRouter
