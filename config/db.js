const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("mongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = mongoose;
