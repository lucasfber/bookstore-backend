const express = require("express")
const auth = require("../middlewares/auth")
const router = express.Router()

const Basket = require("../models/Basket")

/* Get Customer's basket */
router.get("/", auth, async (req, res) => {
  const customer = req.customer.id

  try {
    let basket = await Basket.findOne({ customer }).populate("items")
    if (!basket) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer not found!",
            detail: "An invalid customer'id was sent."
          }
        ]
      })
    }

    basket.items.forEach(item => {
      basket.totalValue += item.price
    })

    return res.json(basket)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Add a book to Customer's basket */
router.put("/:bookId", auth, async (req, res) => {
  try {
    const customer = req.customer.id

    let basket = await Basket.findOne({ customer })

    if (!basket) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's basket not found!",
            detail: "An invalid basket's id was sent."
          }
        ]
      })
    }

    const bookId = req.params.bookId

    basket.items.push(bookId)

    basket = await basket.save()
    res.status(200).json(basket)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Remove a book from Customer's basket */
router.delete("/:bookId", auth, async (req, res) => {
  const customer = req.customer.id

  try {
    let basket = await Basket.findOne({ customer })

    if (!basket) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's basket not found!",
            detail: "An invalid basket's id was sent."
          }
        ]
      })
    }

    const bookId = req.params.bookId
    let items = basket.items

    basket.items = items.filter(
      item => JSON.stringify(item) !== JSON.stringify(bookId)
    )

    await basket.save()

    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
