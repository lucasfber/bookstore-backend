const express = require("express")
const router = express.Router()

const auth = require("../middlewares/auth")
const Order = require("../models/Order")
const ShoppingCart = require("../models/ShoppingCart")

router.post("/", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    const cart = await ShoppingCart.findOne({ customerId }).populate("items")
    const items = cart.items

    if (items.length === 0) {
      return res.status(400).json({
        errors: [
          {
            message: "Your shopping cart is empty!",
            details:
              "You must add items to your shopping cart to perform a purchase."
          }
        ]
      })
    }

    const totalValue = await ShoppingCart.getTotalValue(items)

    let order = new Order({
      ...req.body,
      customerId,
      subtotal: totalValue,
      total: totalValue + req.body.shippingCost - req.body.discount
    })

    order = await order.save()

    await cart.clearItems()

    res.status(200).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

/* Get customer's orders */
router.get("/", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    const orders = await Order.find({ customerId })

    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Get customer's orders
  TODO: POPULATE CORRECTLY
*/
router.get("/:orderId", auth, async (req, res) => {
  try {
    const _id = req.params.orderId

    const order = await Order.findOne({ _id })
      .populate("items")
      .populate("shippingAddress")
      .populate("customerId")

    if (!order) {
      return res.status(404).json({
        errors: [
          {
            message: "Order not found!",
            details: "An invalid order's identifier was sent."
          }
        ]
      })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
