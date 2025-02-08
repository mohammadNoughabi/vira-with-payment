const express = require("express");
const router = express.Router();

const session = require("express-session");

const authController = require("../controllers/authController");

const authenticateToken = require("../middlewares/authenticateToken");

router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
router.post("/pre-register", authController.preRegister);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);

module.exports = { router };
