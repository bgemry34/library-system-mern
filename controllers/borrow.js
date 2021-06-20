const borrowRouter = require('express').Router()
const Borrow = require('../models/borrow')
const User = require('../models/user')
const Book = require('../models/book')

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
// PUT http://localhost:4000/api/borrow/approve/:id
borrowRouter.put('/approve/:id', async (req, res) => {
  const user = req.user
  const id = req.params.id
  const borrowData = await Borrow.findById(id)

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: 'You are not allowed to approve a borrow request' })
      .end()
  }

  borrowData || res.status(404).send({ error: 'Invalid borrow request' }).end()
  borrowStatus = borrowData.status
  borrowStatus === 'pending' ||
    res.status(400).send({ error: `Book is already ${borrowStatus}` })

  const bookId = borrowData.borrowedBook

  const borrow = {
    status: 'approved',
    approvedDate: new Date().toISOString(),
    returnDate: addDays(new Date(), 3).toISOString(),
  }

  await Book.findByIdAndUpdate(bookId, { status: 'borrowed' })
  const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
    new: true,
  })
  return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
})

// CANCEL a borrow request
// PUT http://localhost:4000/api/borrow/cancel/:id
// borrowRouter.put('/cancel/:id', async (req, res) => {
//   const user = req.user
//   const body = req.body
//   const id = req.params.id

//   if (user.userType !== 'admin') {
//     return res
//       .status(401)
//       .send({ error: 'You are not allowed to cancel a borrow request' })
//       .end()
//   }

//   const borrowData = await Borrow.findById(id)

//   if (borrowData.isApproved || borrowData.isReturned) {
//     return res.status(400).send({
//       error: `You can't cancel ${
//         borrowData.isApproved ? 'an approved' : 'a returned'
//       } borrow request`,
//     })
//   }
//   if (borrowData.isCancelled) {
//     return res
//       .status(400)
//       .send({ error: `This borrow request has already been cancelled` })
//   }

//   const bookId = borrowData.borrowedBook
//   const userData = await User.findById(borrowData.user)
//   const userBorrowList = userData.borrowedBooks

//   const borrow = {
//     isCancelled: true,
//     cancelledDate: new Date().toISOString(),
//   }

//   await Book.findByIdAndUpdate(bookId, { status: 'available' }, { new: true })

//   const updatedUserBorrowList = userBorrowList.filter(
//     (borrowItem) => borrowItem !== bookId
//   )

//   await User.findByIdAndUpdate(
//     borrowData.user,
//     { borrowedBooks: updatedUserBorrowList },
//     { new: true }
//   )

//   const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
//     new: true,
//   })

//   return updatedBorrow ? res.json(updatedBorrow) : res.status(400).end()
// })

// borrowRouter.put('/:id', async (req, res) => {
//   const user = req.user
//   const body = req.body
//   const id = req.params.id

//   if (user.userType !== 'admin') {
//     return res
//       .status(401)
//       .send({ error: 'You are not allowed to approve/cancel a borrow request' })
//       .end()
//   }

//   const borrowData = await Borrow.findById(id)
//   const bookId = borrowData.borrowedBook
//   const userData = await User.findById(borrowData.user)
//   const userBorrowList = userData.borrowedBooks

//   if (borrowData.isReturned || borrowData.isCancelled) {
//     return res
//       .status(401)
//       .send({
//         error: `Borrow request has been ${
//           borrowData.isReturned ? 'returned' : 'cancelled'
//         }`,
//       })
//       .end()
//   }

//   let borrow = ''

//   // FOR RETURN
//   if (body.isReturned) {
//     await Book.findByIdAndUpdate(bookId, { status: 'available' }, { new: true })
//     borrow = {
//       returnedDate: new Date().toISOString(),
//       isReturned: true,
//     }
//     const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
//       new: true,
//     })
//     //remove borrow from user
//     const updatedUserBorrowList = userBorrowList.filter(
//       (list) => list !== bookId
//     )
//     await User.findByIdAndUpdate(
//       borrowData.user,
//       { borrowedBooks: updatedUserBorrowList },
//       { new: true }
//     )
//     return res.json(updatedBorrow).end()
//   } else if (body.isCancelled) {
//     borrow = {
//       isCancelled: true,
//       cancelledDate: new Date().toISOString(),
//     }
//     await Book.findByIdAndUpdate(bookId, { status: 'available' }, { new: true })
//     borrow.returnDate = ''
//     const updatedUserBorrowList = userBorrowList.filter(
//       (list) => list !== bookId
//     )
//     await User.findByIdAndUpdate(
//       borrowData.user,
//       { borrowedBooks: updatedUserBorrowList },
//       { new: true }
//     )
//   } else if (body.isApproved) {
//     borrow = {
//       isApproved: body.isApproved,
//       approvedDate: new Date().toISOString(),
//     }
//     await Book.findByIdAndUpdate(bookId, { status: 'borrowed' }, { new: true })
//     borrow.returnDate = addDays(borrow.approvedDate, 3).toISOString()
//   }
//   if (borrow) {
//     const updatedBorrow = await Borrow.findByIdAndUpdate(id, borrow, {
//       new: true,
//     })
//     return res.json(updatedBorrow)
//   }
//   return res.status(400).end()
// })

module.exports = borrowRouter
