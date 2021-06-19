const borrowRouter = require('express').Router()
const Borrow = require('../models/borrow')
const User = require('../models/user')
const Book = require('../models/book')
const userExtractor = require('../utils/middleware').userExtractor

// GET all borrow data
borrowRouter.get('/', async (req, res) => {
  const borrowList = await Borrow.find({})
    .populate('user', {
      name: 1,
      borrowedBooks: 1,
    })
    .populate('borrowedBook', { title: 1, author: 1 })

  return res.json(borrowList)
})

// CREATE a new borrow request
//req.body = {
//  bookId
//}
borrowRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body

  if (!body.bookId) {
    return res
      .status(404)
      .send({ error: 'You must provide a book id to borrow' })
      .end()
  }

  const book = Book.findById(body.bookId)

  const borrow = new Borrow({
    dateBorrowed: new Date(),
    user: user._id,
    dateCreated: new Date(),
    borrowedBook: body.bookId,
  })

  const borrowedBook = await borrow.save()
  user.borrowedBooks = user.borrowedBooks.concat(borrowedBook._id)
  await user.save()

  borrowedBook ? res.json(borrowedBook) : res.status(400).end()
})

const addDays = (date, days) => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// UPDATE a borrow request
// req.body = {
//   approved: Boolean
// }
borrowRouter.put('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: 'You are not allowed to approve a borrow request' })
      .end()
  }

  const borrow = {
    approved: body.approved,
    approvedDate: body.approved ? new Date() : '--',
    cancelledDate: body.approved ? '--' : new Date(),
  }

  if (body.approved) {
    const updatedBook = await Book.findByIdAndUpdate(
      body.bookId,
      { status: 'borrowed' },
      { new: true }
    )
    borrow.books = updatedBook
    borrow.returnDate = addDays(borrow.approvedDate, 3)
  }

  const updatedBorrow = await Borrow(id, borrow, { new: true })
  return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
})

module.exports = borrowRouter
