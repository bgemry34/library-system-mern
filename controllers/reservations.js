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

const dateToday = () => moment(new Date(), 'YYYY/MM/DD')

//reservation must be made 3 days from todays date
const isValidDate = (date) => {
  return moment(date).isAfter(dateToday().add(3, 'day'), 'day')
}

//CREATE a new reservation request
//req.body = { bookId, reservationDate }
// reservationDate = "MM/DD/YYYY"
reservationRouter.post('/', async (req, res, next) => {
  const user = req.user
  const body = req.body
  const bookData = await Book.findById(body.bookId)
  const reservationDate =
    moment(body.reservationDate, 'YYYY/MM/DD') ||
    next(new Error('Invalid date'))

  console.log('reserve:', reservationDate, dateToday())
  if (!body.bookId) {
    return next(new Error('You must provide a book id to borrow'))
  } else if (!bookData) {
    return next(new Error('Invalid book'))
  } else if (!isValidDate(reservationDate)) {
    return next(new Error('Reservation must be made 3 days from today'))
  }

  //check if book is already reserved by user
  const userReservationData = await User.findById(user._id).populate(
    'reservedBooks'
  )
  const userReservationList = userReservationData.reservedBooks.map(
    (book) => book.reservedBook
  )
  if (userReservationList.indexOf(body.bookId) !== -1) {
    return next(new Error(`You can only reserve this book once`))
  }

  //check if book is available for reservation on specified date
  const reservations = await Reserve.find({})
  const isNotAvailableForReservation = reservations.find(
    (reservation) =>
      reservation.bookTitle === bookData.title &&
      reservation.reservationDate === reservationDate
  )
  if (isNotAvailableForReservation) {
    next(
      new Error(
        `${bookData.title} is not available for reserve for ${moment(
          reservationDate
        ).format('YYYY/MM/DD')}. Please select another date`
      )
    )
  }

  const reservation = new Reserve({
    reservationDate,
    user: user._id,
    reservedBook: body.bookId,
    bookTitle: bookData.title,
  })
  const reservedBook = await reservation.save()
  user.reservedBooks = user.reservedBooks.concat(reservedBook._id)
  await user.save()

  return reservedBook
    ? res.status(201).json(reservedBook)
    : res.status(400).end()
})

module.exports = reservationRouter
