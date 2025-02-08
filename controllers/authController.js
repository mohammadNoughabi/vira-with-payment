const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to Generate OTP(one time password)
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Function to Send OTP via SMS
const sendOTP = async (phone, otp) => {
  console.log(otp);
  return true;
};

exports.preRegister = async (req, res) => {
  const phone = req.body.phone;
  if (!phone)
    return res.status(400).json({ error: "Phone number is required." });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser)
      return res.status(400).json({ error: "User already registered." });

    // Generate and Send OTP (one time password)
    const otp = generateOTP();
    const smsSent = await sendOTP(phone, otp);

    // save otp and phone in session storage
    req.session.otp = otp;
    req.session.phone = phone;

    if (!smsSent) return res.status(500).json({ error: "Failed to send OTP." });

    res.json({
      message: "OTP sent successfully. Please verify your phone number.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error.", error: error });
  }
};

exports.register = async (req, res) => {
  const phone = req.session.phone;

  const otp = req.body.otp;
  const username = req.body.username;
  const password = await bcrypt.hash(req.body.password, 10);

  if (!otp || !username || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const storedOTP = req.session.otp;
    if (!storedOTP)
      return res.status(400).json({ error: "OTP expired or invalid." });

    if (storedOTP !== otp)
      return res.status(400).json({ error: "Incorrect OTP." });

    // removing otp and phone from session storage
    req.session.otp = "";
    req.session.phone = "";

    // Save User in Database
    const newUser = new User({
      username: username,
      phone: phone,
      password: password,
    });
    await newUser.save();

    res.json({
      message: "Phone verified successfully. User registered.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error.", error: error });
  }
};

exports.login = async (req, res) => {
  if (!req.body.phone || !req.body.password) {
    res.status(400).send("Phone number & Password are required to login");
  }

  const data = {
    phone: req.body.phone,
    password: req.body.password,
  };

  const existingUser = await User.findOne({ phone: data.phone });
  if (!existingUser) {
    res.status(400).send("user not found");
  } else {
    let isMatch = bcrypt.compare(data.password, existingUser.password);
    if (!isMatch) {
      res.status(400).send("login failed. password is incorrect");
    } else {
      try {
        const token = jwt.sign(
          { userId: existingUser._id, role: existingUser.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        req.session.token = token;
        res.status(200).json({
          message: "login successfull",
          user: existingUser,
          token: token,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "internal server error", error: error });
      }
    }
  }
};

exports.logout = async (req, res) => {};
