const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")

/* 
  Add a new credit card
*/
router.post("/", auth, async (req, res) => {
  try {
    const customerId = res.customer.id
    console.log(customerId)
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
