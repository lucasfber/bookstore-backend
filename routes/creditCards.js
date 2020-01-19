const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const CreditCard = require("../models/CreditCard")
/* 
  Add a new credit card
  VALIDATION IS MISSING!
*/
router.post("/", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    let creditCard = new CreditCard({
      ...req.body,
      customerId
    })

    creditCard = await creditCard.save()

    res.status(200).send(creditCard)
  } catch (error) {
    console.error(error)
    res.send("Server error.")
  }
})

/* Get all customer's credit cards*/
router.get("/", auth, async (req, res) => {})

/* /* Include an item into favorites *
router.put("/:bookId", auth, async (req, res) => {

}) */

/* Remove a customer's credit card */
router.delete("/:cardId", auth, async (req, res) => {})

module.exports = router
