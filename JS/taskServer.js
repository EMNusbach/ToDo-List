const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3002; // Separate port for tasks and notes

app.use(cors());
app.use(bodyParser.json());

const TASK_DATA_FILE = "DATA/tasks_and_notes.json";

// Load tasks and notes
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(TASK_DATA_FILE));
  } catch (error) {
    return {};
  }
};

// Save tasks and notes
const saveData = (data) => {
  fs.writeFileSync(TASK_DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all tasks and notes for a user
app.get("/tasks_notes/:username", (req, res) => {
  const data = loadData();
  const userData = data[req.params.username] || { tasks: [], notes: [] };
  res.json(userData);
});

// Add a new task
app.post("/tasks_notes/:username/task", (req, res) => {
  const data = loadData();
  const { title, description } = req.body;

  if (!data[req.params.username]) {
    data[req.params.username] = { tasks: [], notes: [] };
  }

  const newTask = { id: Date.now(), title, description, completed: false };
  data[req.params.username].tasks.push(newTask);
  saveData(data);

  res.status(201).json(newTask);
});

// Add a new note
app.post("/tasks_notes/:username/note", (req, res) => {
  const data = loadData();
  const { content } = req.body;

  if (!data[req.params.username]) {
    data[req.params.username] = { tasks: [], notes: [] };
  }

  const newNote = { id: Date.now(), content };
  data[req.params.username].notes.push(newNote);
  saveData(data);

  res.status(201).json(newNote);
});

// Update a task
app.put("/tasks_notes/:username/task/:taskId", (req, res) => {
  const data = loadData();
  const { username, taskId } = req.params;
  const { title, description, completed } = req.body;

  if (!data[username]) {
    return res.status(404).json({ message: "User has no tasks or notes" });
  }

  const task = data[username].tasks.find((t) => t.id == taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.completed = completed ?? task.completed;

  saveData(data);
  res.json({ message: "Task updated successfully" });
});

// Update a note
app.put("/tasks_notes/:username/note/:noteId", (req, res) => {
  const data = loadData();
  const { username, noteId } = req.params;
  const { content } = req.body;

  if (!data[username]) {
    return res.status(404).json({ message: "User has no tasks or notes" });
  }

  const note = data[username].notes.find((n) => n.id == noteId);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.content = content || note.content;

  saveData(data);
  res.json({ message: "Note updated successfully" });
});

// Delete a task
app.delete("/tasks_notes/:username/task/:taskId", (req, res) => {
  const data = loadData();
  const { username, taskId } = req.params;

  if (!data[username]) {
    return res.status(404).json({ message: "User has no tasks or notes" });
  }

  data[username].tasks = data[username].tasks.filter((t) => t.id != taskId);
  saveData(data);

  res.json({ message: "Task deleted successfully" });
});

// Delete a note
app.delete("/tasks_notes/:username/note/:noteId", (req, res) => {
  const data = loadData();
  const { username, noteId } = req.params;

  if (!data[username]) {
    return res.status(404).json({ message: "User has no tasks or notes" });
  }

  data[username].notes = data[username].notes.filter((n) => n.id != noteId);
  saveData(data);

  res.json({ message: "Note deleted successfully" });
});

// Start Task & Notes Server
app.listen(PORT, () => {
  console.log(`Task & Notes Server running on http://localhost:${PORT}`);
});
