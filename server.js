require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const morganBody = require("morgan-body");
morganBody(app);
app.use(express.json());

const Book = require("./models/book");

// GET all books
app.get("/api/books", (req, res) => {
  Book.find({}).then((books) => {
    return res.json(books);
  });
});

//CREATE a book
app.post("/api/books", (req, res) => {
  const body = req.body;

  if (!body.title || !body.author || !body.genre) {
    res
      .status(400)
      .end(
        `missing book ${
          !body.title ? "title" : !body.author ? "author" : "genre"
        }`
      );
  }

  const book = new Book({
    title: body.title,
    author: body.author,
    genre: body.genre,
    available: body["available"],
    created_date: new Date(),
  });

  book.save().then((book) => {
    return res.json(book);
  });
});

//DELETE a book
app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id;
  Book.deleteOne({ _id: id })
    .then(() => {
      return res.status(204).end();
    })
    .catch((err) => console.log(err.message));
});

//UPDATE book data
app.put("/api/books/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const book = {
    title: body.title,
    author: body.author,
    genre: body.genre,
    available: body["available"],
    created_date: new Date(),
  };

  Book.findByIdAndUpdate(id, book, { new: true })
    .then((updatedBook) => {
      return res.json(updatedBook);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).end(err.message);
    });
});

// for UKNOWN endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const port = process.env.PORT;
app.listen(port, () => console.log("Server started on port:", port));
