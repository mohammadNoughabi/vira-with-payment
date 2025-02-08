const express = require("express");
const app = express();

// environment variables
require("dotenv").config();

// mongo DB connection
require("./config/db");

// use routes
const router = require("./routes/router");


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
