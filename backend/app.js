const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors module

try {
  mongoose.connect("mongodb://localhost:27017/db");
  console.log("connected to mongodb");
} catch (err) {
  console.log(err.message);
}

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat-message", (msg) => {
    console.log("Message from client:", msg);

    //console.log(JSON.stringify(msg.receiver));
    // Broadcast the message to all connected clients
    io.emit(JSON.stringify(msg.receiver), msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const userschema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userschema);

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ users });
  } catch (error) {
    console.log("error fetching users, try again later ", error);
    res.status(500).send({message:"internal server error"});
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password,
  });
  await newUser.save();
  res.status(200).send({ message: "user saved" });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
