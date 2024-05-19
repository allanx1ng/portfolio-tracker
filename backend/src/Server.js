const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const io = require("socket.io")
const http = require("http")
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET_KEY

const Account = require("./routes/Account.js")
const Authentication = require("./routes/Authentication.js")
const Prices = require("./routes/Prices.js")
const SolTokenFetch = require("./routes/SolTokenFetch.js")

const passportConfig = require("./middleware/PassportConfig")
const AddPortfolio = require("./routes/AddPortfolio.js")

class Server {
  constructor(port) {
    this.app = express()
    this.port = port
    this.server = http.createServer(this.app)
    this.io = io(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"],
      },
    })
    this.init()
  }

  init() {
    this.registerMiddleware()
    this.registerRoutes()
  }

  registerMiddleware() {
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(session({ secret: "somethingsecret", resave: false, saveUninitialized: false }))

    this.app.use(passport.initialize())
    passportConfig(passport) // initialize passport configuration.
    this.app.use(passport.session())

    // JSON parser should be before express.raw
    this.app.use(express.json())
    this.app.use(express.raw({ type: "application/*", limit: "25mb" }))

    // this.io.use((socket, next) => {
    // 	const token = socket.handshake.auth.token;

    // 	if (!token) {
    // 		console.log("Authentication error for socket");
    // 		return next(new Error("Authentication error, no token provided"));
    // 	}

    // 	jwt.verify(token, secretKey, (err, user) => {
    // 		if (err) return next("Authentication error, bad token");
    // 		socket.user = user;

    // 		console.log("Socket user registered and authenticated, ", user.username);
    // 		next();
    // 	});
    // });
  }

  registerRoutes() {
    // Registration
    this.app.post("/register", Account.create)
    this.app.get("/verify-email", Account.verify)

    // fetch asset prices
    this.app.get("/price/:type/:asset", Prices.getPrice)

    // create new portfolio for custom asset adding
    this.app.post("/portfolio/create/:name", Authentication.authenticateToken, AddPortfolio.createPortfolio)
    this.app.delete("/portfolio/delete/:name", Authentication.authenticateToken, AddPortfolio.removePortfolio)

    // get wallet balances:
    this.app.post('/fetch-sol-tokens', SolTokenFetch.fetchTokens)

    this.app.post(
      "/login",
      (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" })
          }
          if (!user) {
            // Determine the appropriate status code and message
            console.log(err, user, info)
            return res.status(info.status || 401).json({ message: info.message || "Authentication failed" })
          }
          // If user is successfully authenticated, forward to Authentication.login
          // req.user = user // Manually set user
          return next() // Pass to the next middleware/function
        })(req, res, next)
      },
      Authentication.login
    )
  }

  start() {
    this.server.listen(this.port, () => {
      // need to use this.server for socket.io
      console.log(`Server listening on port ${this.port}`)
    })
  }
}

module.exports = Server
