const mongoose = require("mongoose")
const Schema = mongoose.Schema

const creditCardSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer"
  },
  number: {
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
