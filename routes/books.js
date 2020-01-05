const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()

const Book = require("../models/Book")
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
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ errros: errors.array() })
    }

    const { isbn, edition } = req.body

    try {
      let book = await Book.findOne({ $and: [{ isbn, edition }] })

      if (book) {
        return res
          .status(400)
          .json({ errors: [{ msg: "This book already exists" }] })
      }

      book = new Book({
        ...req.body
      })

      await book.save()

      res.status(200).json({ msg: "The book was created successfully" })
    } catch (err) {
      console.error(err)
      res.status(500).send("Server error")
    }
  }
)

module.exports = router
