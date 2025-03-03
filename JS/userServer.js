const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001; // Separate port for users

app.use(cors());
app.use(bodyParser.json());

const USER_DATA_FILE = "DATA/users.json";

// Load users
const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USER_DATA_FILE));
  } catch (error) {
    return {};
  }
};

// Save users
const saveUsers = (users) => {
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(users, null, 2));
};

// Register user
app.post("/users/register", (req, res) => {
  const { username, password, email } = req.body;
  const users = loadUsers();

  // Check if username already exists
  if (users[username]) {
    return res.status(400).json({ success: false, message: "Username already taken!" });
  }

  // Save new user with username, password, and email
  users[username] = { username, password, email };
  saveUsers(users);

  res.status(201).json({ success: true, message: "User registered successfully!" });
});

// Login user
app.post("/users/login", (req, res) => {
  const users = loadUsers();
  const { username, password } = req.body;

  // Check if the user exists
  if (!users[username]) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  // Check if the password is correct
  if (users[username].password !== password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true, message: "Login successful", username, email: users[username].email });
});

// Start User Server
app.listen(PORT, () => {
  console.log(`User Server running on http://localhost:${PORT}`);
});
