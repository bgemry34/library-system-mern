const mongoose = require('mongoose')

const reserveSchema = new mongoose.Schema({
  reservationDate: String,
  dateCreated: {
    type: String,
    default: new Date().toISOString(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reservedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  bookTitle: String,
  cancelledDate: String,
  status: {
    type: String,
    default: 'pending',
  },
})
// STATUS: pending || reserved || cancelled

reserveSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Reserve', reserveSchema)
