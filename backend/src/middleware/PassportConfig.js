// const LocalStrategy = require("passport-local").Strategy
// const bcrypt = require("bcrypt")
// // const DatabaseInstance = require("../database/Database")

// passportConfig.js
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const DatabaseInstance = require("../db/Database")

module.exports = (passport) => {
  // Configure the local strategy
  // Mock user data
  // const users = [
  //   { id: 1, username: "admin", password: "secret" },
  //   { id: 2, username: "user", password: "password" },
  // ]

  // Function to find a user by username
  // function findUserByUsername(username) {}

  // Function to verify credentials
  function verifyCredentials(username, password, done) {
    const db = DatabaseInstance.getInstance()
    const query = "SELECT * FROM login WHERE username=$1"
    try {
      db.queryDbValues(query, [username]).then((data) => {
        if (data.length == 0) {
          return done(null, false, {
            message: "No accounts with that username found.",
          })
        }

        bcrypt.compare(password, data[0].password, (err, result) => {
          if (err) {
            return done(err)
          }

          if (!result) {
            return done(null, false, { message: "Incorrect password." })
          }

          return done(null, data[0])
        })
      })
    } catch (err) {
      return done(err)
    }
  }

  passport.use(new LocalStrategy(verifyCredentials))

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const db = DatabaseInstance.getInstance()

      const query = "SELECT * FROM login WHERE username=$1"
      const data = await db.queryDbValues(query, [id])
      if (data.length == 0) {
        return done(null, false, {
          message: "No accounts with that username found.",
        })
      }

      return done(null, data[0])
    } catch (err) {
      done(err, false) // In case of an error
    }
  })
  // db.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
  //   if (err) return done(err);
  //   return done(null, result.rows[0]);
  // });
}

// module.exports = (passport) => {
//   passport.use(
//     new LocalStrategy(function verify(username, password, done) {
//       const db = DatabaseInstance.getInstance()
//       const query = `SELECT * FROM login WHERE username=$1`

//       try {
//         db.queryDbValues(query, [username]).then((data) => {
//           if (data.length == 0) {
//             return done(null, false, {
//               message: "No accounts with that username found.",
//             })
//           }

//           bcrypt.compare(password, data[0].password, (err, result) => {
//             if (err) {
//               return done(err)
//             }

//             if (!result) {
//               return done(null, false, { message: "Incorrect password." })
//             }

//             return done(null, data[0])
//           })
//         })
//       } catch (err) {
//         return done(err)
//       }
//     })
//   )

//   passport.serializeUser((user, done) => {
//     done(null, user.username)
//   })

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const db = DatabaseInstance.getInstance()

//       const query = `SELECT * FROM login WHERE username=$1`
//       const data = await db.queryDbValues(query, [id])
//       if (data.length == 0) {
//         return done(null, false, {
//           message: "No accounts with that username found.",
//         })
//       }

//       return done(null, data[0])
//     } catch (err) {
//       done(err, false) // In case of an error
//     }
//   })
// }
