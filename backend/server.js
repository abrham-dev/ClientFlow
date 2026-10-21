import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
import clientsRouter from "./routes/clients.routes.js";
import usersRouter from "./routes/users.routes.js";
import healthRouter from "./routes/health.routes.js";
import projectsRouter from "./routes/projects.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import authRouter from "./routes/auth.routes.js";
import express from "express";

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ClientFlow API is running");
});

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});