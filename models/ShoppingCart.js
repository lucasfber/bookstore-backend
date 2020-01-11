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

shoppingCartSchema.statics.getTotalValue = async function(items) {
  let totalValue = 0
  items.forEach(i => {
    totalValue += i.price
  })

  return totalValue.toFixed(2)
}

shoppingCartSchema.methods.clearItems = async function() {
  this.items = []
  this.totalValue = 0
  this.save()
}

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema)
