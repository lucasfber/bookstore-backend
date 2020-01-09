const express = require("express")
const router = express.Router()

const auth = require("../middlewares/auth")
const Customer = require("../models/Customer")

const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

/* Get customer info using his token */
router.get("/", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id).select(
      "-password"
    )

    return res.json(customer)
  } catch (err) {
    console.error(err.message)
    return res.status(500).send("Server Error")
  }
})

/* 
  @ route   POST api/auth
  @ desc    Authenticate user & get token - LOGIN
  @ access  Public
*/
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please type your password.").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      let customer = await Customer.findOne({ email })

      if (!customer) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials." }] })
      }

      isMatch = await bcrypt.compare(password, customer.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials." }] })
      }

      const payload = {
        customer: {
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

module.exports = router
