const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  passwordHash: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
  },
  borrowedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrow',
    },
  ],
  reservedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reserve',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
