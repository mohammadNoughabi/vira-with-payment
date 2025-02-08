const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status:{
      type:String,
      enum:["pending" , "succeeded" , "failed"],
      default:'pending'
    },
    transactionType: {
      type: String,
      enum: ["addBalance", "reserveTurn"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const payment = mongoose.model("Payment", paymentSchema);

module.exports = payment;
