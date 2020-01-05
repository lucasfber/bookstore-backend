const mongoose = require("mongoose")
const Schema = mongoose.Schema

const shoppingCartSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer"
  },
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    default: []
  },
  totalValue: {
    type: Number,
    min: 0,
    default: 0
  }
})

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema)
