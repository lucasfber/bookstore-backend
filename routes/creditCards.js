const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middlewares/auth")
const CreditCard = require("../models/CreditCard")

router.post(
  "/",
  [
    auth,
    [
      check("number", "Number is required")
        .not()
        .isEmpty(),
      check("nameOnCard", "Name on Card is required")
        .not()
        .isEmpty(),
      check("expirationDate", "Expiration Date is required")
        .not()
        .isEmpty(),
      check("cvv", "CVV code is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const customer = req.customer.id

      let creditCard = new CreditCard({
        ...req.body,
        customer
      })

      creditCard = await creditCard.save()

      res.status(200).send(creditCard)
    } catch (error) {
      res.send("Server error.")
    }
  }
)

/* Get all customer's credit cards*/
router.get("/", auth, async (req, res) => {
  const customer = req.customer.id

  try {
    const cards = await CreditCard.find({ customer })

    return res.status(200).json(cards)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

router.put("/:creditCardId", auth, async (req, res) => {
  try {
    _id = req.params.creditCardId

    let creditCard = await CreditCard.findOne({ _id })

    if (creditCard) {
      creditCard = await CreditCard.findOneAndUpdate(
        { _id },
        { $set: req.body },
        { new: true }
      )
      return res.status(201).json(creditCard)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Remove a customer's credit card */
router.delete("/:creditCardId", auth, async (req, res) => {
  try {
    _id = req.params.creditCardId

    let creditCard = await CreditCard.findOne({ _id })

    if (!creditCard) {
      return res.status(404).json({
        errors: [
          {
            message: "Credit card not found!",
            detail: "An invalid credit card's id was sent."
          }
        ]
      })
    }

    await CreditCard.findOneAndRemove({ _id })
    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
