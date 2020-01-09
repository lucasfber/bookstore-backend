const express = require("express")
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require("../middlewares/auth")

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

/* Get all Books */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find()

    res.json({ books: books })
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Get a Book by Id */
router.get("/:bookId", async (req, res) => {
  const _id = req.params.bookId

  try {
    const book = await Book.findOne({ _id })

    if (!book) {
      return res.status(404).json({
        errors: [
          {
            message: "Book not found!",
            detail: "An invalid book's id was sent."
          }
        ]
      })
    }
    return res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Update a Book */
router.put("/:bookId", auth, async (req, res) => {
  const _id = req.params.bookId

  try {
    let book = await Book.findOne({ _id })

    if (!book) {
      return res.status(404).json({
        errors: [
          {
            message: "Book not found!",
            detail: "An invalid book's id was sent."
          }
        ]
      })
    }

    book = await Book.findOneAndUpdate({ _id }, { ...req.body }, { new: true })
    res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Delete a book by Id */
router.delete("/:bookId", auth, async (req, res) => {
  const _id = req.params.bookId

  try {
    let book = await Book.findOne({ _id })

    if (!book) {
      return res.status(404).json({
        errors: [
          {
            message: "Book not found!",
            detail: "An invalid book's id was sent."
          }
        ]
      })
    }

    await Book.findOneAndRemove({ _id })
    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
