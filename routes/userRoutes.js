const express = require("express");
const router = express.Router();
require("dotenv").config();

const userController = require("../controllers/userController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../helpers/uploader")

router.get("/get-one/:userId", authenticateToken, userController.getOne);
router.get("/get-all", authorizeRole("admin"), userController.getAll);
router.get(
  "/get-turns/:userId",
  authenticateToken,
  userController.getTurns
);
router.get(
  "/get-payments/:userId",
  authenticateToken,
  userController.getPayments
);
router.post(
  "/update/:userId",
  authenticateToken,
  upload.single('profilePic') ,
  userController.update
);
router.post(
  "/add-balance/:userId",
  authenticateToken,
  userController.addBalance
);
router.post("/delete/:userId", authenticateToken, userController.delete);

module.exports = { router };
