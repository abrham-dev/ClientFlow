import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Define the allowed task statuses.
const validStatuses = ["Todo", "In Progress", "Completed"] as const;

type TaskStatus = (typeof validStatuses)[number];

// Define the expected task request body.
interface TaskBody {
  title?: unknown;
  description?: unknown;
  status?: unknown;
  projectId?: unknown;
}

// Check whether a value is a valid task status.
function isValidTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    (validStatuses as readonly string[]).includes(value)
  );
}

// Get all tasks belonging to the authenticated user.
export async function getTasks(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (userId === undefined) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        // A task belongs to a user through its project and client.
        project: {
          client: {
            userId,
          },
        },
      },
    });

    res.json(tasks);
  } catch (error: unknown) {
    console.error("Error fetching tasks:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a task inside a project owned by the authenticated user.
export async function createTask(
  req: Request<Record<string, string>, unknown, TaskBody>,
  res: Response
): Promise<void> {
  // Safely handle a missing request body.
  const { title, description, status, projectId } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const numericProjectId = Number(projectId);

  // Check that the required fields are provided.
  if (
    typeof title !== "string" ||
    !title.trim() ||
    projectId === undefined ||
    projectId === null ||
    projectId === ""
  ) {
    res.status(400).json({
      message: "Title and projectId are required",
    });
    return;
  }

  // Validate the task status if one was provided.
  if (status !== undefined && !isValidTaskStatus(status)) {
    res.status(400).json({
      message: "Invalid task status",
    });
    return;
  }

  // Description is optional, but must be text when provided.
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    res.status(400).json({
      message: "Description must be a string",
    });
    return;
  }

  // Ensure the project ID is a positive integer.
  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    res.status(400).json({
      message: "Invalid project ID",
    });
    return;
  }

  try {
    // Confirm that the project belongs to the authenticated user.
    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId,
        },
      },
    });

    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
      return;
    }

    // Create the task with validated values.
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
        status: status ?? "Todo",
        projectId: numericProjectId,
      },
    });

    res.status(201).json(task);
  } catch (error: unknown) {
    console.error("Error creating task:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a task belonging to the authenticated user.
export async function updateTask(
  req: Request<{ id: string }, unknown, TaskBody>,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  // Safely handle a missing request body.
  const { title, description, status, projectId } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const numericProjectId = Number(projectId);

  // Validate the task ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid task ID",
    });
    return;
  }

  // Check that the required fields are provided.
  if (
    typeof title !== "string" ||
    !title.trim() ||
    projectId === undefined ||
    projectId === null ||
    projectId === ""
  ) {
    res.status(400).json({
      message: "Title and projectId are required",
    });
    return;
  }

  // Updating a task requires a valid status.
  if (!isValidTaskStatus(status)) {
    res.status(400).json({
      message: "Invalid task status",
    });
    return;
  }

  // Description is optional, but must be text when provided.
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    res.status(400).json({
      message: "Description must be a string",
    });
    return;
  }

  // Validate the destination project ID.
  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    res.status(400).json({
      message: "Invalid project ID",
    });
    return;
  }

  try {
    // Confirm that the existing task belongs to the authenticated user.
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          client: {
            userId,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    // Confirm that the destination project also belongs to this user.
    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId,
        },
      },
    });

    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
      return;
    }

    // Update the task with validated values.
    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
        status,
        projectId: numericProjectId,
      },
    });

    res.json(updatedTask);
  } catch (error: unknown) {
    console.error("Error updating task:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a task belonging to the authenticated user.
export async function deleteTask(
  req: Request<{ id: string }, unknown, unknown>,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Validate the task ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid task ID",
    });
    return;
  }

  try {
    // Confirm that the task belongs to the authenticated user.
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          client: {
            userId,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    // Delete the task after confirming ownership.
    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting task:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}