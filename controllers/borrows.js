const borrowRouter = require('express').Router()
const Borrow = require('../models/borrow')
const User = require('../models/user')
const Book = require('../models/book')

const userIsAdmin = (next, user) => {
  return user.userType === 'admin' || next(new Error('For admin only'))
}

const validBorrowStatus = (next, currentStatus, expectedStatus) => {
  return (
    currentStatus === expectedStatus ||
    next(new Error(`Borrow request has been ${currentStatus}`))
  )
}

const addDays = (date, days) => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// GET all borrow data
borrowRouter.get('/', async (req, res) => {
  const user = req.user
  const userType = user.userType
  let borrowList = {}

  if (userType === 'admin') {
    borrowList = await Borrow.find({}).populate('user', {
      name: 1,
      username: 1,
    })
  } else if (userType === 'student') {
    borrowList = await Borrow.findById(user._id).populate('user', {
      name: 1,
      username: 1,
    })
  }

  return res.json(borrowList)
})

// GET all 'pending/approved/cancelled' requests
borrowRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user
  const userType = user.userType
  let borrowList = {}

  if (userType === 'admin') {
    borrowList = await Borrow.find({})
      .populate('user', {
        name: 1,
        username: 1,
      })
      .sort({ bookTitle: 1 })
  } else if (userType === 'student') {
    borrowList = await Borrow.find({ user: user._id })
      .populate('user', {
        name: 1,
        username: 1,
      })
      .sort({ bookTitle: 1 })
  }
  filteredBorrowList = borrowList.filter((list) => list.status === id)
  return res.json(filteredBorrowList)
})

// CREATE a new borrow request
//req.body = bookId, borrowerId
borrowRouter.post('/', async (req, res, next) => {
  const user = req.user
  const body = req.body
  const bookData = await Book.findById(body.bookId)
  const borrower = body.borrowerId ? await User.findById(body.borrowerId) : user

  if (!body.bookId) {
    return next(new Error('You must provide a book id to borrow'))
  } else if (!bookData) {
    return next(new Error('Invalid book'))
  }

  //check if borrower already borrowed the book
  const borrowerData = await User.findById(borrower._id).populate(
    'borrowedBooks'
  )
  const borrowerBorrowList = borrowerData.borrowedBooks.map(
    (book) => book.borrowedBook
  )
  if (borrowerBorrowList.indexOf(body.bookId) !== -1) {
    return next(new Error(`${borrower.name} already borrowed this book`))
  }

  let borrow = {}

  if (bookData.status === 'available' && user.userType === 'admin') {
    borrow = new Borrow({
      dateBorrowed: new Date().toISOString(),
      user: borrower._id,
      borrowedBook: body.bookId,
      bookTitle: bookData.title,
      status: 'approved',
      approvedDate: new Date().toISOString(),
      returnDate: addDays(new Date(), 3).toISOString(),
    })
    await Book.findByIdAndUpdate(body.bookId, { status: 'borrowed' })
  } else {
    borrow = new Borrow({
      dateBorrowed: new Date().toISOString(),
      user: borrower._id,
      borrowedBook: body.bookId,
      bookTitle: bookData.title,
    })
  }
  const borrowedBook = await borrow.save()
  borrower.borrowedBooks = borrower.borrowedBooks.concat(borrowedBook._id)
  await borrower.save()

  return borrowedBook
    ? res.status(201).json(borrowedBook)
    : res.status(400).end()
})

// APPROVE a borrow request
// user: ADMIN only
// PUT http://localhost:4000/api/borrow/approve/:id
borrowRouter.put('/approve/:id', async (req, res, next) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  if (!borrowData) {
    return next(new Error('Invalid borrow request'))
  }

  if (
    userIsAdmin(next, user) &&
    validBorrowStatus(next, borrowData.status, 'pending')
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
    }).populate('user', {
      name: 1,
      username: 1,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

// CANCEL a borrow request
// user: STUDENT and ADMIN
// PUT http://localhost:4000/api/borrow/cancel/:id
borrowRouter.put('/cancel/:id', async (req, res, next) => {
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  if (!borrowData) {
    return next(new Error('Invalid borrow request'))
  }

  if (validBorrowStatus(next, borrowData.status, 'pending')) {
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
    }).populate('user', {
      name: 1,
      username: 1,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

// RETURN a book
// user: STUDENT and ADMIN
// PUT http://localhost:4000/api/borrow/return/:id
borrowRouter.put('/return/:id', async (req, res, next) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  if (!borrowData) {
    return next(new Error('Invalid borrow request'))
  }

  if (
    userIsAdmin(next, user) &&
    validBorrowStatus(next, borrowData.status, 'approved')
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
    }).populate('user', {
      name: 1,
      username: 1,
    })
    return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
  }
})

module.exports = borrowRouter
