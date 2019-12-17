const express = require("express")
const router = express.Router()

router.get("/", (req, res) => res.json("Profiles route working"))

module.exports = router
