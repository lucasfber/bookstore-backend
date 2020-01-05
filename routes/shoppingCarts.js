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
        .json({ msg: "The shopping cart was saved successfully" })
    } catch (err) {
      console.error(err)
      return res.status(500).send("Server error")
    }
  }
)

router.get("/:customerId", async (req, res) => {
  /* TODO: handle 404 error */
  const customerId = req.params.customerId
  let cart = await ShoppingCart.findOne({ customerId }).populate("customerId")
  console.log(cart)
  res.json(cart)
})

module.exports = router
