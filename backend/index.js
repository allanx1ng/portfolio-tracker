const Server = require("./src/Server")
require("dotenv").config()
const PORT = 4321

const server = new Server(PORT)

server.start()
