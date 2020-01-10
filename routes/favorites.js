const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Favorites = require("../models/Favorites")
const ObjectId = require("mongoose").Types.ObjectId

/* Create the Customer's Favorites 
  Put this on pre method, when a customer has been created.
  * Is this route really necessary?
*/
router.post("/", async (req, res) => {
  try {
    const favorites = new Favorites({
      ...req.body
    })

    await favorites.save()

    return res
      .status(200)
      .json({ msg: "The favorites was created successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).send("Server error")
  }
})

/* Get customer's favorites */
router.get("/", auth, async (req, res) => {
  const customerId = req.customer.id

  try {
    const favorites = await Favorites.findOne({ customerId }).populate("items")
    if (!favorites) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer not found!",
            detail: "An invalid customer'id was sent."
          }
        ]
      })
    }

    return res.json(favorites.items)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error.")
  }
})

/* Include an item into favorites */
router.put("/:bookId", auth, async (req, res) => {
  try {
    const customerId = req.customer.id

    let favorites = await Favorites.findOne({ customerId })

    if (!favorites) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's favorites not found!",
            detail: "An invalid favorites' id was sent."
          }
        ]
      })
    }

    const bookId = req.params.bookId

    favorites.items.push(bookId)

    favorites = await favorites.save()

    res.status(200).json(favorites)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error.")
  }
})

/* Remove a book from customer's favorites */
router.delete("/:bookId", auth, async (req, res) => {
  const customerId = req.customer.id

  try {
    let favorites = await Favorites.findOne({ customerId })

    if (!favorites) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer's favorites not found!",
            detail: "An invalid favorites' id was sent."
          }
        ]
      })
    }
    const bookId = req.params.bookId
    let items = favorites.items

    favorites.items = items.filter(
      item => JSON.stringify(item) !== JSON.stringify(bookId)
    )

    await favorites.save()

    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
