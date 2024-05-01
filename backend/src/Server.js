const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const io = require("socket.io")
const http = require("http")
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET_KEY;