
import prisma from "../lib/prisma.js";

// Get all tasks belonging to the authenticated user.
export async function getTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        // A task belongs to a user through its project and client.
        project: {
          client: {
            userId: req.user.userId,
          },
        },
      },
    });

    return res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a task inside a project owned by the authenticated user.
export async function createTask(req, res) {
  // Safely handle a missing request body.
  const { title, description, status, projectId } = req.body ?? {};

  const numericProjectId = Number(projectId);

  // Only allow these task statuses.
  const validStatuses = ["Todo", "In Progress", "Completed"];

  // Check that the required fields are provided.
  if (
    typeof title !== "string" ||
    !title.trim() ||
    projectId === undefined ||
    projectId === null ||
    projectId === ""
  ) {
    return res.status(400).json({
      message: "Title and projectId are required",
    });
  }

  // Validate the task status if one was provided.
  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid task status",
    });
  }

  // Description is optional, but it must be text when provided.
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  // Ensure the project ID is a positive integer.
  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  try {
    // Confirm that the project belongs to the authenticated user.
    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId: req.user.userId,
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
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

    return res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a task belonging to the authenticated user.
export async function updateTask(req, res) {
  const id = Number(req.params.id);

  // Safely handle a missing request body.
  const { title, description, status, projectId } = req.body ?? {};

  const numericProjectId = Number(projectId);

  const validStatuses = ["Todo", "In Progress", "Completed"];

  // Validate the task ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  // Check that the required fields are provided.
  if (
    typeof title !== "string" ||
    !title.trim() ||
    projectId === undefined ||
    projectId === null ||
    projectId === ""
  ) {
    return res.status(400).json({
      message: "Title and projectId are required",
    });
  }

  // Updating a task requires a valid status.
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid task status",
    });
  }

  // Description is optional, but it must be text when provided.
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  // Validate the destination project ID.
  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  try {
    // Confirm that the existing task belongs to the authenticated user.
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          client: {
            userId: req.user.userId,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Confirm that the destination project also belongs to this user.
    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId: req.user.userId,
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Update the task with the validated values.
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

    return res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a task belonging to the authenticated user.
export async function deleteTask(req, res) {
  const id = Number(req.params.id);

  // Validate the task ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  try {
    // Confirm that the task belongs to the authenticated user.
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          client: {
            userId: req.user.userId,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Delete the task after confirming ownership.
    await prisma.task.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
