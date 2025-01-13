const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const connection = mongoose.connection;
    
    connection.on("connected", () => console.log("Connect to DB"));
    connection.on("error", (error) => console.log("Something is whong in mongodb", error));
  } catch (error) {
    console.log("Somethin is wront", error);
  }
}

module.exports = connectDB