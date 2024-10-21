const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

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
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: new Date().toISOString(),
  },
  borrowedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
    },
  ],
  reservedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reserve",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  // If the password has not been modified, skip hashing
  if (!this.isModified("password")) {
    next();
  }

  // If the password is modified, hash it
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(this.password, saltRounds);
  this.password = passwordHash;
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
