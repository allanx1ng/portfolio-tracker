const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const DatabaseInstance = require("../db/Database")

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // This specifies that the LocalStrategy should expect an 'email' field instead of 'username'
        passwordField: "password", // This is optional if you are using 'password' as the field name, it's by default expected
      },
      function verifyCredentials(email, password, done) {
        const db = DatabaseInstance.getInstance()
        const query = "SELECT * FROM login WHERE email=$1" // Changed from username to email

        try {
          db.queryDbValues(query, [email]).then((data) => {
            if (data.length === 0) {
              return done(null, false, {
                message: "No account with that email found.",
                status: 404,
              })
            }

            // console.log("Hash of the user inputted password:", hashedPassword)
            bcrypt.compare(password, data[0].password, (err, result) => {
              if (err) {
                return done(err)
              }

              // For debugging: Log the result of bcrypt compare
              console.log("Bcrypt comparison result:", result)

              if (!result) {
                return done(null, false, { message: "Incorrect password.", status: 401 })
              }

              return done(null, data[0])
            })
          })
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.email) // Assuming you are storing the user's email in the user object
  })

  passport.deserializeUser(async (email, done) => {
    const db = DatabaseInstance.getInstance()
    const query = "SELECT * FROM login WHERE email=$1"

    try {
      const data = await db.queryDbValues(query, [email])
      if (data.length === 0) {
        return done(null, false, { message: "No account with that email found.", status: 404 })
      }

      return done(null, data[0])
    } catch (err) {
      done(err, false) // In case of an error
    }
  })
}
