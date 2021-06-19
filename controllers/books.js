const jwt = require('jsonwebtoken')
const booksRouter = require('express').Router()
const Book = require('../models/book')
const userExtractor = require('../utils/middleware').userExtractor

// GET all books
booksRouter.get('/', userExtractor, async (req, res) => {
  const books = await Book.find({})
  return res.json(books)
})

// GET a specific book
booksRouter.get('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const book = await Book.findById(req.params.id)
  return res.json(book)
})

//CREATE a book
booksRouter.post('/', userExtractor, async (req, res) => {
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
    publish: body.publish,
    genre: body.genre,
    status: body.status,
    dateCreated: new Date().toISOString(),
  })

  const newBook = await book.save()
  return newBook ? res.json(newBook) : res.status(400).end()
})

//DELETE a book
booksRouter.delete('/:id', userExtractor, async (req, res) => {
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
booksRouter.put('/:id', userExtractor, async (req, res) => {
  const body = req.body
  const id = req.params.id
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to update a book` })
      .end()
  }

  const book = {
    status: body.status,
  }

  const newBook = await Book.findByIdAndUpdate(id, book, { new: true })
  return newBook ? res.json(newBook) : res.status(404).end()
})

module.exports = booksRouter
