const express = require("express")
const auth = require("../middlewares/auth")
const router = express.Router()

/* Is this route really necessary? */
const ShoppingCart = require("../models/ShoppingCart")

router.post("/", async (req, res) => {
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
})

/* Get Customer's Shopping Cart */
router.get("/", auth, async (req, res) => {
  const customerId = req.customer.id

  try {
    let cart = await ShoppingCart.findOne({ customerId }).populate("items")
    if (!cart) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer not found!",
            detail: "An invalid customer'id was sent."
          }
        ]
      })
    }

    cart.items.forEach(item => {
      cart.totalValue += item.price
    })

    return res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Add a book to Customer's Shopping Cart */
router.put("/:bookId", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    let cart = await ShoppingCart.findOne({ customerId })

    if (!cart) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's shopping cart not found!",
            detail: "An invalid shopping cart's id was sent."
          }
        ]
      })
    }

    const bookId = req.params.bookId

    cart.items.push(bookId)

    cart = await cart.save()
    res.status(200).json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Remove a book from Customer's Shopping Cart */
router.delete("/:bookId", auth, async (req, res) => {
  const customerId = req.customer.id

  try {
    let cart = await ShoppingCart.findOne({ customerId })

    if (!cart) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's cart not found!",
            detail: "An invalid shopping cart's id was sent."
          }
        ]
      })
    }

    const bookId = req.params.bookId
    let items = cart.items

    cart.items = items.filter(
      item => JSON.stringify(item) !== JSON.stringify(bookId)
    )

    await cart.save()

    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
