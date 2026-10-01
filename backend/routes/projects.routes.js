import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getProjects);
router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id",  authenticateToken, deleteProject);

export default router;