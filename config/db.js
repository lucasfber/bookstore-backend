const mongoose = require("mongoose")
const config = require("config")
const dbURI = config.get("mongoURI")

const connectDatabase = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log("Connected to MongoDB")
  } catch (err) {
    console.error(err.message)
  }
}

module.exports = connectDatabase
