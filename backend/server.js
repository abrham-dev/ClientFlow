import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import clientsRouter from "./routes/clients.routes.js";
import usersRouter from "./routes/users.routes.js";
import healthRouter from "./routes/health.routes.js";
import projectsRouter from "./routes/projects.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import authRouter from "./routes/auth.routes.js";

// Load environment variables from the .env file.
dotenv.config();

const app = express();

// Use the hosting platform's port, or port 5000 locally.
const PORT = process.env.PORT || 5000;

// Allow requests from the frontend.
// FRONTEND_URL should contain the deployed frontend's origin in production.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Parse incoming JSON request bodies so controllers can access req.body.
app.use(express.json());

// Root endpoint for checking whether the API is responding.
app.get("/", (req, res) => {
  res.send("ClientFlow API is running");
});

// Register API routes.
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});