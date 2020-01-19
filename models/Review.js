const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer"
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book"
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    max: 500
  },
  date: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "Customer" }]
  },
  dislikes: {
    type: [{ type: Schema.Types.ObjectId, ref: "Customer" }]
  }
})

module.exports = mongoose.model("Review", reviewSchema)
