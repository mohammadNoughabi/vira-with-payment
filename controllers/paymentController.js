const Payment = require("../models/payment");
const Turn = require("../models/turn");
const User = require("../models/user");
const canceledTurn = require("../models/canceledTurn");

exports.verify = async (req, res) => {
  try {
    const { paymentId, status, amount, userId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "no payment found" });
    }

    if (status === "succeeded") {
      payment.status = "succeeded";
      await payment.save();

      if (payment.transactionType === "reserveTurn") {
        const turn = await Turn.findOne({ paymentId: payment._id });
        if (!turn) {
          return res.status(404).json({ message: "turn not found" });
        }

        turn.status = "paid";
        await turn.save();

        return res
          .status(200)
          .json({ message: "payment verified . turn reserved" });
      } else if (payment.transactionType === "addBalance") {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }

        user.balance += amount;
        await user.save();

        return res
          .status(200)
          .json({ message: "payment verified . user balance updated." });
      }
    } else {
      payment.status = "failed";
      await payment.save();

      if (payment.transactionType === "reserveTurn") {
        const turn = await Turn.findOne({ paymentId: payment._id });
        if (turn) {
          turn.status = "failed";
          const newCanceledTurn = turn;
          await newCanceledTurn.save();
          await Turn.findByIdAndDelete(turn._id);
        }
      } else if (payment.transactionType === "addBalance") {
        const user = await User.findById(userId);
        await User.findByIdAndUpdate(
          { _id: userId },
          { balance: user.balance - amount }
        );
        await user.save();
      }

      return res.status(400).json({ message: "payment failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "error in payment process", error: error });
  }
};

exports.getOne = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const payments = await Payment.find();
    res
      .status(200)
      .json({ message: "All payments recieved", payments: payments });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error });
  }
};
