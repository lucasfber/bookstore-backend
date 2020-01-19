const express = require("express")
const router = express.Router()

const auth = require("../middlewares/auth")
const Review = require("../models/Review")

/* Creates an order */
router.post("/", auth, async (req, res) => {
  try {
    const customer = req.customer.id

    let review = new Review({
      ...req.body,
      customer
    })

    review = await review.save()

    res.status(200).json(review)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Gets all reviews for a book 
  is auth really necessary?
*/
router.get("/:id", auth, async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.id
    }).populate("customer", ["name"])

    res.status(200).json(reviews)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

/* Like a review */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const customer = req.customer.id

    let review = await Review.findOne({ _id: req.params.id })

    if (!review) {
      return res.status(404).json({
        errors: [
          {
            message: "Review not found!",
            details:
              "Unable to like! Possibly an invalid review identifier was sent."
          }
        ]
      })
    }

    if (review.likes.filter(customer => customer === customer).length > 0) {
      return res.status(400).json({
        errors: [
          {
            message: "You already liked this review",
            details: "Unable to like! You already liked this review."
          }
        ]
      })
    }

    if (review.dislikes.filter(customer => customer === customer).length > 0) {
      review.dislikes = review.dislikes.filter(
        customer => customer !== customer
      )
      review.likes.push(customer)
      review = await review.save()
      return res.json(review)
    }

    review.likes.push(customer)

    review = await review.save()

    res.json(review)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

/* Dislike a review */
router.put("/dislike/:id", auth, async (req, res) => {
  try {
    const customer = req.customer.id

    let review = await Review.findOne({ _id: req.params.id })

    if (!review) {
      return res.status(404).json({
        errors: [
          {
            message: "Review not found!",
            details:
              "Unable to like! Possibly an invalid review identifier was sent."
          }
        ]
      })
    }

    if (review.dislikes.filter(customer => customer === customer).length > 0) {
      return res.status(400).json({
        errors: [
          {
            message: "You already disliked this review",
            details: "Unable to dislike! You already disliked this review."
          }
        ]
      })
    }

    if (review.likes.filter(customer => customer === customer).length > 0) {
      review.likes = review.likes.filter(customer => customer !== customer)
      review.dislikes.push(customer)
      review = await review.save()
      return res.json(review)
    }

    review.dislikes.push(customer)

    review = await review.save()

    res.json(review)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

router.delete("/:id", auth, async (req, res) => {
  const customer = req.customer.id

  try {
    const review = await Review.findOne({ _id: req.params.id })

    if (!review) {
      return res.status(404).json({
        errors: [
          {
            message: "Review not found!",
            details:
              "Review not found! Possibly an invalid review identifier was sent."
          }
        ]
      })
    }

    if (review.customer.toString() !== customer) {
      return res.status(400).json({
        errors: [
          {
            message: "Unable to delete!",
            details: "Unable to delete! You can delete only your reviews."
          }
        ]
      })
    }

    await Review.findOneAndDelete({ _id: req.params.id })

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

module.exports = router
