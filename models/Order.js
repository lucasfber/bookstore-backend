const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "MyBookStoreCard", "Bank Slip", "Pay at the Store"]
  },
  creditCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditCard"
  },
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  },
  shippingType: {
    type: String,
    enum: ["Normal", "Express"],
    default: "Normal"
  },
  shippingCost: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number
  },
  discount: {
    type: Number,
    required: true
  },
  total: {
    type: Number
  },
  received: {
    type: Boolean,
    default: false
  },
  receivedOn: {
    type: Date
  },
  shoppingDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Order", orderSchema)
