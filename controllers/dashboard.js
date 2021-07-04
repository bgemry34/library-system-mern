const dashboardRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Reserve = require('../models/reserve')
const Borrow = require('../models/borrow')

//GET all data for admin
dashboardRouter.get('/', async (req, res) => {
  const user = req.user
  const userType = req.user.userType

  let dashboardData = ''

  if (userType === 'admin') {
    const books = await Book.find({})
    const totalBooks = books.length
    const totalBorrowedBooks = books.filter(
      (book) => book.status === 'borrowed'
    ).length
    const students = await User.find({ userType: 'student' })
    const totalStudents = students.length
    const recentAddedBooks = await Book.find({})
      .sort({ dateCreated: -1 })
      .limit(5)
    const recentAddedStudents = await User.find({ userType: 'student' })
      .sort({ dateCreated: -1 })
      .limit(5)
    const recentReservations = await Reserve.find({})
      .sort({ dateCreated: -1 })
      .limit(5)
      .populate('user', {
        name: 1,
        username: 1,
      })
    const recentBorrows = await Borrow.find({})
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
  }

  return res.json(dashboardData)
})

module.exports = dashboardRouter
