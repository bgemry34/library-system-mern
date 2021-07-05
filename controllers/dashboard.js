const dashboardRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Reserve = require('../models/reserve')
const Borrow = require('../models/borrow')
const moment = require('moment')

//GET all data for admin
dashboardRouter.get('/', async (req, res) => {
  const user = req.user
  const userType = req.user.userType

  let dashboardData = ''

  if (userType === 'admin') {
    //BOOKS
    const books = await Book.find({}).sort({ dateCreated: -1 })
    const totalBooks = books.length
    const recentAddedBooks = books.slice(0, 5)

    //STUDENTS
    const students = await User.find({ userType: 'student' }).sort({
      dateCreated: -1,
    })
    const totalStudents = students.length
    const recentAddedStudents = students.slice(0, 5)

    //BORROW
    const totalBorrowedBooks = books.filter(
      (book) => book.status === 'borrowed'
    ).length
    const recentBorrows = await Borrow.find({})
      .sort({ dateCreated: -1 })
      .limit(5)
      .populate('user', {
        name: 1,
        username: 1,
      })

    //RESERVE
    const recentReservations = await Reserve.find({})
      .sort({ dateCreated: -1 })
      .limit(5)
      .populate('user', {
        name: 1,
        username: 1,
      })

    dashboardData = {
      counts: { totalBooks, totalBorrowedBooks, totalStudents },
      recentBooks: recentAddedBooks,
      recentStudents: recentAddedStudents,
      recentBorrows: recentBorrows,
      recentReservations: recentReservations,
    }
  } else if (userType === 'student') {
    const today = new Date()

    const userData = await User.findById(user._id)
      .populate('borrowedBooks', {
        status: 1,
        dateBorrowed: 1,
        dateCreated: 1,
        dateApproved: 1,
        returnDate: 1,
        bookTitle: 1,
      })
      .populate('reservedBooks', {
        status: 1,
        reservationDate: 1,
        dateCreated: 1,
        dateApproved: 1,
        bookTitle: 1,
      })

    //COUNTS
    const totalBorrowedBooks = userData.borrowedBooks.filter(
      (book) => book.status === 'approved'
    ).length
    const totalPendingReservations = userData.reservedBooks.filter(
      (book) => book.status === 'pending'
    ).length
    const totalReservedBooks = userData.reservedBooks.filter(
      (book) => book.status === 'reserved'
    ).length

    //BORROW DATA
    const borrowedBooks = userData.borrowedBooks
      .filter((book) => book.status === 'approved')
      .sort(function (left, right) {
        return moment.utc(left.timeStamp).diff(moment.utc(right.timeStamp))
      })

    const forReturn = borrowedBooks.filter((book) =>
      moment(today).isSameOrAfter(book.returnDate)
    )
    // RESERVATION DATA
    const pendingReservations = userData.reservedBooks
      .filter((book) => book.status === 'pending')
      .sort(function (left, right) {
        return moment.utc(left.timeStamp).diff(moment.utc(right.timeStamp))
      })

    dashboardData = {
      counts: {
        totalBorrowedBooks,
        totalReservedBooks,
        totalPendingReservations,
      },
      forReturn,
      pendingReservations,
    }
  }

  return dashboardData ? res.json(dashboardData) : res.status(400).end()
})

module.exports = dashboardRouter
