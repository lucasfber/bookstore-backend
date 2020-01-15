const express = require("express")
const auth = require("../middlewares/auth")
const router = express.Router()

const Basket = require("../models/Basket")

/* Is this route really necessary? */
/* router.post("/", async (req, res) => {
  try {
    const shoppingCart = new ShoppingCart({
      ...req.body
    })

    await shoppingCart.save()

    return res
      .status(200)
      .json({ message: "The shopping cart was saved successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).send("Server error")
  }
}) */

/* Get Customer's basket */
router.get("/", auth, async (req, res) => {
  const customerId = req.customer.id

  try {
    let basket = await Basket.findOne({ customerId }).populate("items")
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
    const customerId = req.customer.id

    let basket = await Basket.findOne({ customerId })

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
  const customerId = req.customer.id

  try {
    let basket = await Basket.findOne({ customerId })

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
