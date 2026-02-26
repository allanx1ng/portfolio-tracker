const { Pool } = require("pg")
require("dotenv").config()

class DatabaseInstance {
  static instance = null

  constructor() {
    const ENV = process.env.NODE_ENV
    const poolConfig = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    }

    if (ENV === "production") {
      poolConfig.ssl = { rejectUnauthorized: false }
    }

    this.pool = new Pool(poolConfig)

    // Prevent idle client errors from crashing the process
    this.pool.on("error", (err) => {
      console.error("Unexpected database pool error:", err.message)
    })
  }

  static getInstance() {
    if (DatabaseInstance.instance == null) {
      DatabaseInstance.instance = new DatabaseInstance()
    }
    return DatabaseInstance.instance
  }

  async queryDb(queryText) {
    const client = await this.pool.connect()
    try {
      console.log(queryText)
      const res = await client.query(queryText)
      return res.rows
    } finally {
      client.release()
    }
  }

  async queryDbValues(queryText, queryValues) {
    const client = await this.pool.connect()
    try {
      console.log(queryText, queryValues)
      const res = await client.query(queryText, queryValues)
      return res.rows
    } finally {
      client.release()
    }
  }
}

module.exports = DatabaseInstance
