const User = require("../models/user");
const Turn = require("../models/turn");
const Payment = require("../models/payment");
require("dotenv").config();

exports.getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.update = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = {
      username: req.body.username.trim(),
      phone: req.body.phone.trim(),
      password: req.body.password.trim(),
      profilePic: req.files.profilePic,
      address: req.body.address.trim(),
      email: req.body.email.trim(),
      age: req.body.age,
      gender: req.body.gender,
    };

    await User.findByIdAndUpdate(
      { _id: userId },
      {
        username: data.username || existingUser.username,
        phone: data.phone || existingUser.phone,
        password: data.password || existingUser.password,
        profilePic: data.profilePic || existingUser.profilePic,
        address: data.address || existingUser.address,
        email: data.email || existingUser.email,
        age: data.age || existingUser.age,
        gender: data.gender || existingUser.gender,
      }
    );
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    await User.findByIdAndDelete({ _id: req.params.userId });
    res
      .status(200)
      .json({ message: "user deleted successfully", deletedUser: user });
  } catch (error) {
    res.status(500).json({ message: "user deletetion failed" });
  }
};

exports.addBalance = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const amount = req.body.amount;
    const newPayment = new Payment({
      user: user._id,
      amount: amount,
      status: "pending",
      transactionType: "reserveTurn",
    });
    await newPayment.save();
    await User.findByIdAndUpdate(
      { _id: userId },
      { balance: user.balance + amount }
    );
    const paymentGatewayURL = `https://payment-gateway.com/pay?paymentId=${newPayment._id}`;
    res.status(201).json({
      message: "redirecting to payment gateway",
      paymentUrl: paymentGatewayURL,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.getTurns = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userTurns = await Turn.find({ userId: req.params.userId });
    if (userTurns.length == 0) {
      res.status(400).json({ message: "no turns reserved by this user yet" });
    }
    res.status(200).json({
      message: "user turns found successfully",
      user: user,
      userTurns: userTurns,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userPayments = await Payment.find({ userId: req.params.userId });
    if (userPayments.length == 0) {
      res.status(400).json({ message: "no payments done by this user yet" });
    }
    res.status(200).json({
      message: "user payments found successfully",
      user: user,
      userPayments: userPayments,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};
