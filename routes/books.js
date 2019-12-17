const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()

router.post(
  "/",
  [
    check("isbn", "ISBN is required")
      .not()
      .isEmpty(),
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("gender", "Gender is required")
      .not()
      .isEmpty(),
    check("price", "Price is required")
      .not()
      .isEmpty(),
    check("author", "Author is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ errros: errors.array() })
    }
    res.json("Books route working")
  }
)

module.exports = router
