const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const borrowSchema = new mongoose.Schema({
  dateBorrowed: {
    type: Date,
  },
  returnDate: String,
  dateCreated: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  borrowedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvedDate: String,
  isReturned: {
    type: Boolean,
    default: false,
  },
  returnedDate: String,
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancelledDate: String,
})

borrowSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Borrow', borrowSchema)
