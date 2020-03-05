const mongoose = require("mongoose")

const connectDatabase = async dbURI => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    console.log("Connected to MongoDB")
  } catch (err) {
    console.error(err.message)
  }
}

const closeConnection = async () => {
  await mongoose.disconnect()
}

module.exports = { connectDatabase, closeConnection }
