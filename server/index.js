const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
