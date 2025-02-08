const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../helpers/uploader");

router.get("/get-one/:blogId", blogController.getOne);
router.get("/get-all", blogController.getAll);
router.post(
  "/create",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  blogController.create
);
router.post(
  "/update/:blogId",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  blogController.update
);
router.post(
  "/delete/:blogId",
  authenticateToken,
  authorizeRole("admin"),
  blogController.delete
);

module.exports = { router };
