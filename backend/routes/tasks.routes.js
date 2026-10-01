import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

export default router;