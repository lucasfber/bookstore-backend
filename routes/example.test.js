const app = require("../server").app
const server = require("../server").server
const supertest = require("supertest")
const request = supertest(app)
const connectToDatabase = require("../config/db").connectDatabase
const disconnect = require("../config/db").closeConnection
const config = require("config")
const bookRouter = require("../routes/books")
const Book = require("../models/Book")
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

beforeAll(async () => {
  connectToDatabase(config.get("mongoURITestEnv"))
  await Book.deleteMany({}).exec()
})

it("Gets all books", async () => {
  const response = await request.get("/api/books")

  expect(response.status).toBe(200)
  expect(response.body).toBeInstanceOf(Object)
})

it("Creates a book", async () => {
  const response = await request.post("/api/books").send({
    isbn: "039130910",
    title: "Test",
    gender: "Gender X",
    price: 10,
    author: "John Doe",
    edition: 2
  })

  expect(response.status).toBe(200)
  expect(response.body.isbn).toBe("039130910")
  expect(response.body._id).toBeDefined()
})

afterAll(() => {
  server.close()
  closeConnection()
})
