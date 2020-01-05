const mongoose = require("mongoose")
const Schema = mongoose.Schema

const favoritesSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer"
  },
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    default: []
  }
})

module.exports = mongoose.model("Favorites", favoritesSchema)
