const borrowRouter = require('express').Router()
const Borrow = require('../models/borrow')
const User = require('../models/user')
const Book = require('../models/book')

const userIsAdmin = (res, user) => {
  return (
    user.userType === 'admin' ||
    res
      .status(401)
      .send({ error: 'You are not allowed to approve a borrow request' })
      .end()
  )
}

const validBorrowStatus = (res, currentStatus, expectedStatus) => {
  return (
    currentStatus === expectedStatus ||
    res
      .status(400)
      .send({ error: `Borrow request is already ${currentStatus}` })
      .end()
  )
}

const addDays = (date, days) => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// GET all borrow data
borrowRouter.get('/', async (req, res) => {
  const borrowList = await Borrow.find({}).populate('user', {
    name: 1,
    username: 1,
  })
  return res.json(borrowList)
})

// CREATE a new borrow request
//req.body = bookId
borrowRouter.post('/', async (req, res) => {
  const user = req.user
  const body = req.body
  const bookData = await Book.findById(body.bookId)

  body.bookId ||
    res
      .status(404)
      .send({ error: 'You must provide a book id to borrow' })
      .end()
  bookData || res.status(404).send({ error: 'Invalid book' }).end()

  const borrow = new Borrow({
    dateBorrowed: new Date(),
    user: user._id,
    borrowedBook: body.bookId,
    bookTitle: bookData.title,
  })
  const borrowedBook = await borrow.save()

  user.borrowedBooks = user.borrowedBooks.concat(borrowedBook._id)
  await user.save()

  return borrowedBook
    ? res.status(201).json(borrowedBook)
    : res.status(400).end()
})

// APPROVE a borrow request
// user: ADMIN only
// PUT http://localhost:4000/api/borrow/approve/:id
borrowRouter.put('/approve/:id', async (req, res) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  borrowData || res.status(404).send({ error: 'Invalid borrow request' }).end()
  if (
    userIsAdmin(res, user) &&
    validBorrowStatus(res, borrowData.status, 'pending')
  ) {
    const bookId = borrowData.borrowedBook
    await Book.findByIdAndUpdate(bookId, { status: 'borrowed' })

    const borrow = {
      status: 'approved',
      approvedDate: new Date().toISOString(),
      returnDate: addDays(new Date(), 3).toISOString(),
    }
    const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
      new: true,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

// CANCEL a borrow request
// user: STUDENT and ADMIN
// PUT http://localhost:4000/api/borrow/cancel/:id
borrowRouter.put('/cancel/:id', async (req, res) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  borrowData || res.status(404).send({ error: 'Invalid borrow request' }).end()

  if (validBorrowStatus(res, borrowData.status, 'pending')) {
    const bookId = borrowData.borrowedBook
    const userData = await User.findById(borrowData.user)
    const userBorrowList = userData.borrowedBooks

    await Book.findByIdAndUpdate(bookId, { status: 'available' })
    const updatedUserBorrowList = userBorrowList.filter(
      (borrowItem) => borrowItem !== bookId
    )
    await User.findByIdAndUpdate(borrowData.user, {
      borrowedBooks: updatedUserBorrowList,
    })

    const borrow = {
      status: 'cancelled',
      cancelledDate: new Date().toISOString(),
    }
    const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
      new: true,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

// RETURN a book
// user: STUDENT and ADMIN
// PUT http://localhost:4000/api/borrow/return/:id
borrowRouter.put('/return/:id', async (req, res) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  borrowData || res.status(404).send({ error: 'Invalid borrow request' }).end()

  if (
    userIsAdmin(res, user) &&
    validBorrowStatus(res, borrowData.status, 'approved')
  ) {
    const bookId = borrowData.borrowedBook
    const userData = await User.findById(borrowData.user)
    const userBorrowList = userData.borrowedBooks

    await Book.findByIdAndUpdate(bookId, { status: 'available' })
    const updatedUserBorrowList = userBorrowList.filter(
      (borrowItem) => borrowItem !== bookId
    )
    await User.findByIdAndUpdate(borrowData.user, {
      borrowedBooks: updatedUserBorrowList,
    })

    const borrow = {
      status: 'returned',
      returnedDate: new Date().toISOString(),
    }
    const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
      new: true,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

module.exports = borrowRouter
