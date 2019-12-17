const mongoose = require("mongoose")
const bookSchema = new mongoose({
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 1
  },
  publisher: {
    type: String
  },
  description: {
    type: String
  },
  edition: {
    type: Number
  },
  year: {
    type: Number
  },
  ratingByUsers: {
    type: Number,
    default: 0
  },
  coverUrl: {
    type: String
  },
  author: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Book", bookSchema)
