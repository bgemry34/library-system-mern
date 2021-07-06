const reservationRouter = require('express').Router()
const Reserve = require('../models/reserve')
const User = require('../models/user')
const Book = require('../models/book')
const moment = require('moment')
const Borrow = require('../models/borrow')

const validReserveStatus = (
  next,
  currentStatus,
  expectedStatus,
  otherparam
) => {
  return (
    currentStatus === expectedStatus ||
    otherparam === 'reserved' ||
    next(
      new Error(
        `This request ${
          currentStatus === 'pending'
            ? 'is waiting for approval'
            : currentStatus === 'reserved'
            ? 'is already approved for reservation'
            : 'is cancelled'
        }`
      )
    )
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

// GET all 'pending/approved/cancelled' requests
reservationRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user
  const userType = user.userType
  let reserveList = {}

  if (userType === 'admin') {
    reserveList = await Reserve.find({})
      .populate('user', {
        name: 1,
        username: 1,
      })
      .sort({ bookTitle: 1 })
  } else if (userType === 'student') {
    reserveList = await Reserve.find({ user: user._id })
      .populate('user', {
        name: 1,
        username: 1,
      })
      .sort({ bookTitle: 1 })
  }
  filteredReserveList = reserveList.filter((list) => list.status === id)
  return res.json(filteredReserveList)
})

//GET a specific reservation data
reservationRouter.get('/:id', async (req, res) => {
  const reserveList = await Reserve.findById(req.params.id).populate('user', {
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
    return next(new Error(`You can only reserve ${bookData.title} once`))
  }

  //check if book is available for reservation on specified date
  const reservations = await Reserve.find({})
  const isNotAvailableForReservation = reservations.find(
    (reservation) =>
      reservation.bookTitle === bookData.title &&
      reservation.reservationDate === reservationDate
  )

  const isBetweenBorrowDates = async () => {
    // check book status
    const borrowList = await Borrow.find({})
    const borrow = borrowList.find(
      (borrow) =>
        borrow.bookTitle === bookData.title && borrow.status === 'approved'
    )
    if (!borrow) {
      return false
    }
    const returnDate = borrow.returnDate
    const approvedDate = borrow.approvedDate
    return reservationDate.isBetween(approvedDate, returnDate)
  }

  if (isNotAvailableForReservation) {
    return next(
      new Error(
        `${bookData.title} is not available for reserve for ${moment(
          reservationDate
        ).format('YYYY/MM/DD')}, Please select another date`
      )
    )
  } else if (await isBetweenBorrowDates()) {
    return next(
      new Error(
        `${bookData.title} is still not available for ${moment(
          reservationDate
        ).format('YYYY/MM/DD')}, Please select another date`
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

// APPROVE a reservation request
// PUT http://localhost:4000/api/reserve/approve/:id
reservationRouter.put('/approve/:id', async (req, res, next) => {
  const id = req.params.id
  const reserveData = await Reserve.findById(id)
  const userType = req.user.userType

  if (userType !== 'admin') {
    return next(new Error('Unauthorized user'))
  }
  if (!reserveData) {
    return next(new Error('Invalid reservation request'))
  }

  if (validReserveStatus(next, reserveData.status, 'pending')) {
    const reserve = {
      status: 'reserved',
      approvedDate: new Date().toISOString(),
    }

    const updatedReserve = await Reserve.findByIdAndUpdate(id, reserve, {
      new: true,
    }).populate('user', {
      name: 1,
      username: 1,
      reservedBooks: 1,
    })
    return updatedReserve ? res.json(updatedReserve) : res.status(400).end()
  }
})

// CANCEL a reservation request
// PUT http://localhost:4000/api/reserve/cancel/:id
reservationRouter.put('/cancel/:id', async (req, res, next) => {
  const id = req.params.id
  const reserveData = await Reserve.findById(id)
  const userType = req.user.userType

  if (userType !== 'admin') {
    return next(new Error('Unauthorized user'))
  }
  if (!reserveData) {
    return next(new Error('Invalid reservation request'))
  }

  if (reserveData.cancelledDate) {
    return next(new Error('This request is already cancelled'))
  }

  if (validReserveStatus(next, reserveData.status, 'pending', 'reserved')) {
    const userData = await User.findById(reserveData.user)
    const userReserveList = userData.reservedBooks

    const updatedUserReserveList = userReserveList.filter((reserveItem) => {
      return String(reserveItem) !== String(reserveData._id)
    })

    await User.findByIdAndUpdate(reserveData.user, {
      reservedBooks: updatedUserReserveList,
    })

    const reserve = {
      status: 'cancelled',
      cancelledDate: new Date().toISOString(),
    }

    const updatedReserve = await Reserve.findByIdAndUpdate(id, reserve, {
      new: true,
    }).populate('user', {
      name: 1,
      username: 1,
      reservedBooks: 1,
    })
    return updatedReserve ? res.json(updatedReserve) : res.status(400).end()
  }
})

module.exports = reservationRouter
