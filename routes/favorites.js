const express = require("express")
const router = express.Router()

const Favorites = require("../models/Favorites")
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

router.get("/:customerId", async (req, res) => {
  const customerId = req.params.customerId

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

router.put("/:favoritesId", async (req, res) => {
  const id = req.params.favoritesId
  try {
    let favorites = await Favorites.findById({ _id: id })

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

    const bookId = req.body.bookId

    if (!bookId) {
      return res.status(400).json({
        errors: [
          {
            message: "An invalid book's id was sent.",
            detail: "An invalid or a empty id was sent on the request"
          }
        ]
      })
    }

    favorites.items.push(bookId)

    favorites = await favorites.save()
    res.json(favorites)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error.")
  }
})

module.exports = router
