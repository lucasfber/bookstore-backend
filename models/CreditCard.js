const mongoose = require("mongoose")

const creditCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true
  },
  nameOnCard: {
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  cvv: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model("CreditCard", creditCardSchema)
