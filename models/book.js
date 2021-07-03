const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'available',
  },
  dateCreated: {
    type: Date,
    default: new Date().toISOString(),
  },
})

// status: available, borrowed

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

bookSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', bookSchema)
