const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middlewares/auth")

const Customer = require("../models/Customer")

/* 
  @ desc - Creates a new customer
  @ access - Public
*/
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6
    }),
    check("cpf", "CPF is required.")
      .not()
      .isEmpty(),
    check("cpf", "Enter the 11 cpf's digits.").isLength({
      min: 11,
      max: 11
    })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password, cpf } = req.body

    try {
      let customer = await Customer.findOne({
        $or: [{ email: email }, { cpf: cpf }]
      })

      if (customer) {
        return res
          .status(400)
          .json({ errors: [{ msg: "This customer already exists" }] })
      }

      customer = new Customer({
        ...req.body
      })

      const salt = await bcrypt.genSalt(10)

      customer.password = await bcrypt.hash(password, salt)

      await customer.save()

      const payload = {
        user: {
          id: customer.id
        }
      }

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err

          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err)
      res.status(500).send("Server error")
    }
  }
)

/* TODO: handle 404 error for this route
  Is this route really necessary?
*/
router.get("/:customerId", async (req, res) => {
  const id = req.params.customerId

  const customer = await Customer.findOne({ _id: id }).populate({
    path: "favorites",
    populate: { path: "items" }
  })

  res.json(customer)
})

/* Edit a Customer Info */
router.put("/", auth, async (req, res) => {
  let _id = req.customer.id

  try {
    let customer = await Customer.findOne({ _id })

    if (!customer) {
      return res.status(404).json({
        errors: [
          {
            message: "Customer not found!",
            detail: "An invalid customer's id was sent."
          }
        ]
      })
    }

    customer = await Customer.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    )
    res.status(200).json(customer)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

/* Delete the user/account */
router.delete("/", auth, async (req, res) => {
  const _id = req.customer.id

  try {
    return res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error.")
  }
})

module.exports = router
