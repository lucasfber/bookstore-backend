const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  receiver: {
    type: String,
    required: true
  },
  addressType: {
    type: String,
    enum: ["Apartment", "House", "Commercial"]
  },
  cep: {
    type: String
  },
  street: {
    type: String,
    required: true
  },
  complement: {
    type: String
  },
  number: {
    type: Number
  },
  info: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  }
})

module.exports = mongoose.model("Address", addressSchema)
