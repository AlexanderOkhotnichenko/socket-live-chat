const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require("./routes/index");
const cookieParser = require('cookie-parser');
const { app, server } = require("./socket/index");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.json({
    message: "Server run" + PORT
  })
});

app.get('/api/check-cookie', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "No token found" });
  }
});


//* API endpoints
app.use('/api', router);

connectDB().then(() => {
  server.listen(PORT, () => console.log("Server running on port " + PORT))
});

module.exports = app;