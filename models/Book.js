const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true
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
    type: Number,
    required: true
  },
  year: {
    type: Number
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
