const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()

const Address = require("../models/Address")
router.post(
  "/",
  [
    check("receiver", "Receiver's name is required")
      .not()
      .isEmpty(),
    check("street", "Street's name is required")
      .not()
      .isEmpty(),
    check(
      "number",
      "Your must enter your house/apartment's number, if exists"
    ).isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errros: errors.array() })
    }

    try {
      const address = new Address({
        ...req.body
      })

      await address.save()

      return res
        .status(200)
        .json({ msg: "The address was created successfully" })
    } catch (err) {
      console.error(err)
      return res.status(500).send("Server error")
    }
  }
)

module.exports = router
