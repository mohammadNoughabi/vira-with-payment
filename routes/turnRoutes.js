const express = require("express");
const router = express.Router();

const session = require("express-session");

const turnController = require("../controllers/turnController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

router.get(
  "/get-all",
  authenticateToken,
  authorizeRole("admin"),
  turnController.getAll
);
router.get("/get-one/:turnId", authenticateToken, turnController.getOne);
router.post(
  "/create/:userId",
  authenticateToken,
  turnController.create
);
router.post("/delete/:turnId", authenticateToken, turnController.delete);

module.exports = { router };
