const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
