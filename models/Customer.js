const mongoose = require("mongoose")
const Book = require("./Book")

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  phone: {
    type: String
  },
  cpf: {
    type: String,
    required: true,
    min: 11,
    max: 11
  },
  gender: {
    type: String,
    enum: ["M", "F"],
    default: "M"
  },
  address: {
    type: [String]
  },
  birthDate: {
    type: Date
  },
  shoppingCart: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
  },
  favorites: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
