const borrowRouter = require('express').Router()
const Borrow = require('../models/borrow')
const User = require('../models/user')
const Book = require('../models/book')

// GET all borrow data
borrowRouter.get('/', async (req, res) => {
  const borrowList = await Borrow.find({})
    .populate('user', {
      name: 1,
      username: 1,
    })
    .populate('borrowedBook', { title: 1, author: 1 })

  return res.json(borrowList)
})

// CREATE a new borrow request
//req.body = {
//  bookId
//}
borrowRouter.post('/', async (req, res) => {
  const user = req.user
  const body = req.body

  if (!body.bookId) {
    return res
      .status(404)
      .send({ error: 'You must provide a book id to borrow' })
      .end()
  }

  const borrow = new Borrow({
    dateBorrowed: new Date(),
    user: user._id,
    dateCreated: new Date(),
    borrowedBook: body.bookId,
  })

  const borrowedBook = await borrow.save()
  user.borrowedBooks = user.borrowedBooks.concat(borrowedBook._id)
  await user.save()

  borrowedBook ? res.status(201).json(borrowedBook) : res.status(400).end()
})

const addDays = (date, days) => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// UPDATE a borrow request
// req.body = {
//   isApproved: Boolean
// }
// BOOK is returned
// req.body = {
//   isReturned: Boolean
// }
borrowRouter.put('/:id', async (req, res) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: 'You are not allowed to approve/cancel a borrow request' })
      .end()
  }

  const borrowData = await Borrow.findById(id)
  const bookId = borrowData.borrowedBook
  const userData = await User.findById(borrowData.user)
  const userBorrowList = userData.borrowedBooks

  if (borrowData.isReturned || borrowData.isCancelled) {
    return res
      .status(401)
      .send({
        error: `Borrow request has been ${
          borrowData.isReturned ? 'returned' : 'cancelled'
        }`,
      })
      .end()
  }

  let borrow = ''

  // FOR RETURN
  if (body.isReturned) {
    await Book.findByIdAndUpdate(bookId, { status: 'available' }, { new: true })
    borrow = {
      returnedDate: new Date().toISOString(),
      isReturned: true,
    }
    const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
      new: true,
    })
    //remove borrow from user
    const updatedUserBorrowList = userBorrowList.filter(
      (list) => list !== bookId
    )
    await User.findByIdAndUpdate(
      borrowData.user,
      { borrowedBooks: updatedUserBorrowList },
      { new: true }
    )
    return res.json(updatedBorrow).end()
  } else if (body.isCancelled) {
    borrow = {
      isCancelled: true,
      cancelledDate: new Date().toISOString(),
    }
    await Book.findByIdAndUpdate(bookId, { status: 'available' }, { new: true })
    borrow.returnDate = ''
    const updatedUserBorrowList = userBorrowList.filter(
      (list) => list !== bookId
    )
    await User.findByIdAndUpdate(
      borrowData.user,
      { borrowedBooks: updatedUserBorrowList },
      { new: true }
    )
  } else if (body.isApproved) {
    borrow = {
      isApproved: body.isApproved,
      approvedDate: new Date().toISOString(),
    }
    await Book.findByIdAndUpdate(bookId, { status: 'borrowed' }, { new: true })
    borrow.returnDate = addDays(borrow.approvedDate, 3).toISOString()
  }
  if (borrow) {
    const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
      new: true,
    })
    return res.json(updatedBorrow)
  }
  return res.status(400).end()
})

module.exports = borrowRouter
