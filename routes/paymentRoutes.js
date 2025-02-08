const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

const session = require("express-session");

router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/get-one/:paymentId", authenticateToken, paymentController.getOne);
router.get(
  "/get-all",
  authenticateToken,
  authorizeRole("admin"),
  paymentController.getAll
);
router.post("/verify", authenticateToken, paymentController.verify);

module.exports = { router };
