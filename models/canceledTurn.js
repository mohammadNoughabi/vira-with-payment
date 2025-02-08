const mongoose = require("mongoose");

const canceledTurnSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    interceptionCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      expires: 3600 * 7,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const canceledTurn = mongoose.model("CanceledTurn", canceledTurnSchema);

module.exports = canceledTurn;
