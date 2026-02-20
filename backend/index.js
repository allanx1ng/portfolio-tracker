require("dotenv").config()
const Server = require("./src/Server")
const PORT = 4321

const server = new Server(PORT)

server.start()
