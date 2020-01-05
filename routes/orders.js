const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()

const Order = require("../models/Order")
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      ...req.body
    })

    await order.save()

    res.status(200).json({ msg: "Your order was created successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

module.exports = router
