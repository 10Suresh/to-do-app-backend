import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MongoUri;
const frontendURL = process.env.URL_FRONTEND;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: frontendURL,  // Allows requests from frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  });

// Define Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false }
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express with MongoDB!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
