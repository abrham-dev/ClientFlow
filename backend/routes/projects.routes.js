import express from "express";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;