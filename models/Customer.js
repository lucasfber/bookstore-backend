const mongoose = require("mongoose")

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
  birthDate: {
    type: Date,
    min: "01-01-1970"
  },
  shoppingCart: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
    ] /* will change to objectId */
  },
  favorites: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
    ] /* will change to objectId */
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Customer", customerSchema)
