import prisma from "../lib/prisma.js";

export async function getTasks(req, res) {
  let tasks;

  try {
    tasks = await prisma.task.findMany({
      where: {
        project: {
          client: {
            userId: req.user.userId,
          },
        },
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.json(tasks);
}


export async function createTask(req, res) {
  const { title, description, completed, projectId } = req.body;

  const numericProjectId = Number(projectId);

  if (!title || !description || completed === undefined || !projectId) {
    return res.status(400).json({
      message: "Title, description, completed, and projectId are required",
    });
  }

  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "Completed must be true or false",
    });
  }

  try {
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed,
        projectId: numericProjectId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


export async function updateTask(req, res) {
  const id = Number(req.params.id);

  const { title, description, completed, projectId } = req.body;

  const numericProjectId = Number(projectId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  if (!title || !description || completed === undefined || !projectId) {
    return res.status(400).json({
      message: "Title, description, completed, and projectId are required",
    });
  }

  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "Completed must be true or false",
    });
  }

  try {
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

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        completed,
        projectId: numericProjectId,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


export async function deleteTask(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  try {
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

    await prisma.task.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.json({
    message: "Task deleted successfully",
  });
}