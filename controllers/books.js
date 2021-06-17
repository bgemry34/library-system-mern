const booksRouter = require('express').Router()
const Book = require('../models/book')

// GET all books
booksRouter.get('/', (req, res) => {
  Book.find({}).then((books) => {
    return res.json(books)
  })
})

// GET a specific book
booksRouter.get('/:id', (req, res) => {
  Book.findById(req.params.id).then((book) => {
    return res.json(book)
  })
})

//CREATE a book
booksRouter.post('/', (req, res) => {
  const body = req.body

  if (!body.title || !body.author || !body.genre) {
    res
      .status(400)
      .end(
        `missing book ${
          !body.title ? 'title' : !body.author ? 'author' : 'genre'
        }`
      )
  }

  const book = new Book({
    title: body.title,
    author: body.author,
    genre: body.genre,
    available: body['available'],
    created_date: new Date(),
  })

  book.save().then((book) => {
    return res.json(book)
  })
})

//DELETE a book
booksRouter.delete('/:id', (req, res) => {
  const id = req.params.id
  Book.deleteOne({ _id: id })
    .then(() => {
      return res.status(204).end()
    })
    .catch((err) => console.log(err.message))
})

//UPDATE book data
booksRouter.put('/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  const book = {
    title: body.title,
    author: body.author,
    genre: body.genre,
    available: body['available'] || false,
    created_date: new Date(),
  }

  Book.findByIdAndUpdate(id, book, { new: true })
    .then((updatedBook) => {
      return res.json(updatedBook)
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).end(err.message)
    })
})

module.exports = booksRouter
