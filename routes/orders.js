const express = require("express")
const router = express.Router()

const auth = require("../middlewares/auth")
const Order = require("../models/Order")
const Basket = require("../models/Basket")

/* Creates an order */
router.post("/", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    const basket = await Basket.findOne({ customerId }).populate("items")
    const items = basket.items

    if (items.length === 0) {
      return res.status(400).json({
        errors: [
          {
            message: "Your basket is empty!",
            details: "You must add items to your basket to perform a purchase."
          }
        ]
      })
    }

    const totalValue = await Basket.getTotalValue(items)

    let order = new Order({
      ...req.body,
      customerId,
      subtotal: totalValue,
      total: totalValue + req.body.shippingCost - req.body.discount
    })

    order = await order.save()

    await basket.clearItems()

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
      .populate("items")
      .populate("shippingAddress")
      .populate("customerId")
      .populate("creditCardId")

    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Get a customer's orders
  TODO: POPULATE CORRECTLY
*/
router.get("/:orderId", auth, async (req, res) => {
  try {
    const _id = req.params.orderId

    const order = await Order.findOne({ _id })
      .populate("items")
      .populate("shippingAddress")
      .populate("customerId")
      .populate("creditCardId")

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

/* TO DO */
/* Set an order as received */
router.put("/:orderId", auth, async (req, res) => {
  try {
    let order = await Order.findOne({ _id: req.params.orderId })

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

    order = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { received: true },
      { new: true }
    )

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

module.exports = router
