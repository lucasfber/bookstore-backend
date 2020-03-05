const mongoose = require("mongoose")
const Schema = mongoose.Schema

const basketSchema = new Schema({
  customer: {
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

basketSchema.statics.getTotalValue = async function(items) {
  let totalValue = 0
  items.forEach(i => {
    totalValue += i.price
  })

  return totalValue.toFixed(2)
}

basketSchema.methods.clearItems = async function() {
  this.items = []
  this.totalValue = 0
  this.save()
}

module.exports = mongoose.model("Basket", basketSchema)
