const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()

const ShoppingCart = require("../models/ShoppingCart")
router.post(
  "/",
  [check("totalValue", "Your must enter a valid number").isNumeric()],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errros: errors.array() })
    }

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
  }
)

router.get("/:customerId", async (req, res) => {
  /* TODO: handle 404 error */
  const customerId = req.params.customerId

  try {
    let cart = await ShoppingCart.findOne({ customerId }).populate("items")
    console.log(cart)
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
    return res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

router.put("/:cartId", async (req, res) => {
  /* TODO: Handle 404 error */

  const id = req.params.cartId
  try {
    let cart = await ShoppingCart.findById({ _id: id })
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
    const bookId = req.body.bookId

    if (!bookId) {
      return res.status(400).json({
        errors: [
          {
            message: "An invalid book's id was sent.",
            detail: "An invalid or a empty id was sent on the request"
          }
        ]
      })
    }

    cart.items.push(bookId)

    cart = await cart.save()
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

module.exports = router
