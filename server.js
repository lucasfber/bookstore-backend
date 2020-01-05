const express = require("express")
const connectToDatabase = require("./config/db")
const PORT = process.env.PORT || 5000

const app = express()

// Connect database
connectToDatabase()

// Init middlewares
app.use(express.json({ extended: false }))

app.use("/api/auth", require("./routes/auth"))
app.use("/api/customers", require("./routes/customers"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/shopping-carts", require("./routes/shoppingCarts"))
app.use("/api/favorites", require("./routes/favorites"))
app.use("/api/address", require("./routes/address"))
app.use("/api/books", require("./routes/books"))
app.use("/api/profiles", require("./routes/profiles"))

app.get("/", (req, res) => res.send("API is running"))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
