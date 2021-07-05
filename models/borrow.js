const mongoose = require('mongoose')

const borrowSchema = new mongoose.Schema({
  dateBorrowed: {
    type: Date,
  },
  returnDate: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  borrowedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',  
  },
  status: {
    type: String,
    default: 'pending',
  },
  bookTitle: String,
  approvedDate: String,
  returnedDate: String,
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
