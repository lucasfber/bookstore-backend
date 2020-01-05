const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
    type: Schema.Types.ObjectId,
    ref: "ShoppingCart"
  },
  favorites: {
    type: Schema.Types.ObjectId,
    ref: "Favorites"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Customer", customerSchema)
