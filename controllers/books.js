const booksRouter = require('express').Router()
const Book = require('../models/book')
const mongoose = require('mongoose')

function sanitizeString(str) {
  return str.replace(/[-_]/g, ' ')
}

// GET all books
booksRouter.get('/', async (req, res) => {
  const books = await Book.find({}).sort({title: 1})
  return res.json(books)
})

// GET a specific book
booksRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  let book = ''

  if (mongoose.isValidObjectId(id)) {
    book = await Book.findById(id)
  } else {
    const title = sanitizeString(decodeURI(id))
    book = await Book.find({
      title: { $regex: new RegExp(title, 'i') },
    })
  }

  return book
    ? res.json(book)
    : res.status(404).send({ error: `Book not found` }).end()
})

//CREATE a book
booksRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to add a book` })
      .end()
  }

  const book = new Book({
    title: body.title,
    author: body.author,
    genre: body.genre,
    dateCreated: new Date().toISOString(),
  })

  const newBook = await book.save()
  return newBook ? res.status(201).json(newBook) : res.status(400).end()
})

//DELETE a book
booksRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to remove a book` })
      .end()
  }

  await Book.findByIdAndRemove(id)
  return res.status(204).end()
})

//UPDATE book data
booksRouter.put('/:id', async (req, res) => {
  const body = req.body
  const id = req.params.id
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to update a book` })
      .end()
  }

  const bookData = await Book.findById(id)
  if (!bookData) {
    return res.status(404).send({ error: 'invalid book' })
  }

  const book = {
    title: body.title ? body.title : bookData.title,
    author: body.author ? body.author : bookData.author,
    genre: body.genre ? body.genre : bookData.genre,
    status: body.status ? body.status : bookData.status,
  }

  const newBook = await Book.findByIdAndUpdate(id, book, { new: true })
  return newBook ? res.json(newBook) : res.status(404).end()
})

module.exports = booksRouter
