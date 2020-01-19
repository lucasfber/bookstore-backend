const express = require("express")
const connectToDatabase = require("./config/db").connectDatabase
const config = require("config")
const PORT = process.env.PORT || 5000

const app = express()

// Connect database
connectToDatabase(config.get("mongoURI"))

// Init middlewares
app.use(express.json({ extended: false }))

app.use("/api/auth", require("./routes/auth"))
app.use("/api/address", require("./routes/address"))
app.use("/api/basket", require("./routes/baskets"))
app.use("/api/books", require("./routes/books"))
app.use("/api/customers", require("./routes/customers"))
app.use("/api/creditcard", require("./routes/creditCards"))
app.use("/api/favorites", require("./routes/favorites"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/profiles", require("./routes/profiles"))

app.get("/test", (req, res) => res.status(200).json("API is running"))

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
)

module.exports = { app, server }
