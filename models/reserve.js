const mongoose = require('mongoose')

const reserveSchema = new mongoose.Schema({
  dateReserved: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
  dateCreated: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
})

reserveSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Reserve', reserveSchema)
