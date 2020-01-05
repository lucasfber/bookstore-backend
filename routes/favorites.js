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

  /* TODO: Handle 404 error */
  const favorites = await Favorites.findOne({ customerId }).populate("items")

  res.json(favorites.items)
})

module.exports = router
