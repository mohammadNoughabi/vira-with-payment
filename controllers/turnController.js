const Turn = require("../models/turn");
const User = require("../models/user");
const CanceledTurn = require("../models/canceledTurn");
const Payment = require("../models/payment");

function generateInterceptionCode(length) {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

exports.getOne = async (req, res) => {
  try {
    const turn = await Turn.findById(req.params.turnId);
    res.status(200).json({ turn: turn });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const turns = await Turn.find();
    res.status(200).json({ turns: turns });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.create = async (req, res) => {
  try {
    const data = {
      date: req.body.date,
      time: req.body.time,
      userId: req.params.userId,
      interceptionCode: generateInterceptionCode(5),
      description: req.body.description,
      cost: req.body.cost,
    };
    let existingTurn = Turn.find({ date: data.date } && { time: data.time });
    if (existingTurn) {
      res.status(400).json({ message: "this turn is no available to reserve" });
    }
    const newPayment = new Payment({
      user: data.userId,
      amount: data.cost,
      status: "pending",
      transactionType: "reserveTurn",
    });
    await newPayment.save();
    const newTurn = new Turn({
      userId: data.userId,
      date: data.date,
      time: data.time,
      cost: data.cost,
      description: data.description,
      paymentId: newPayment._id,
      status: "pending",
      interceptionCode: generateInterceptionCode(5),
    });
    await newTurn.save();
    const paymentGatewayURL = `https://payment-gateway.com/pay?paymentId=${newPayment._id}`;
    res.status(201).json({
      message: "redirecting to payment gateway",
      paymentUrl: paymentGatewayURL,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};


exports.delete = async (req, res) => {
  try {
    const turn = await Turn.findById(req.params.turnId);
    const newCanceledTurn = new CanceledTurn({
      date: turn.date,
      time: turn.time,
      userId: turn.userId,
      paymentId: turn.paymentId,
      interceptionCode: turn.interceptionCode,
    });

    newCanceledTurn.save();
    await Turn.findByIdAndDelete(req.params.turnId);

    res.status(500).json({
      message: "turn canceled successfully",
      canceledTurn: newCanceledTurn,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};
