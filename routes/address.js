const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require("../middlewares/auth")
const Address = require("../models/Address")

/* Create An Address */
router.post(
  "/",
  [
    auth,
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
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errros: errors.array() })
    }

    try {
      const customer = req.customer.id

      const address = new Address({
        ...req.body,
        customer
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

/* Get Customer's Adresses by Id */
router.get("/:customer", auth, async (req, res) => {
  const customer = req.params.customer

  try {
    let addresses = await Address.find({ customer })

    if (!addresses) {
      res.status(404).json({
        errors: [
          {
            message: "Customer not found!",
            detail: "An invalid customer'id was sent."
          }
        ]
      })
    }
    res.json(addresses)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error.")
  }
})

/* Update An Address */
router.put("/:addressId", auth, async (req, res) => {
  const _id = req.params.addressId

  try {
    let address = await Address.findOne({ _id })

    if (!address) {
      return res.status(404).json({
        errors: [
          {
            message: "Address not found!",
            detail: "An invalid address' id was sent."
          }
        ]
      })
    }

    address = await Address.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    )
    return res.status(200).json(address)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error.")
  }
})

/* Delete an Address */
router.delete("/:addressId", auth, async (req, res) => {
  const _id = req.params.addressId

  try {
    let address = await Address.findOne({ _id })

    if (!address) {
      return res.status(404).json({
        errors: [
          {
            message: "Address not found!",
            detail: "An invalid address' id was sent."
          }
        ]
      })
    }

    await Address.findOneAndDelete({ _id })
    res.status(204).json({ message: "The address was deleted successfully." })
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
