const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middlewares/auth")
const CreditCard = require("../models/CreditCard")

/* 
  Add a new credit card
  VALIDATION IS MISSING! [DONE]
*/
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

/* /* Include an item into favorites *
router.put("/:bookId", auth, async (req, res) => {

}) */

/* Remove a customer's credit card */
router.delete("/:cardId", auth, async (req, res) => {})

module.exports = router
