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
  const { title, description, status, projectId } = req.body

  const numericProjectId = Number(projectId)
  const validStatuses = ['Todo', 'In Progress', 'Completed']

  if (!title?.trim() || !projectId) {
    return res.status(400).json({
      message: 'Title and projectId are required',
    })
  }

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid task status',
    })
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      message: 'Description must be a string',
    })
  }

  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: 'Invalid project ID',
    })
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId: req.user.userId,
        },
      },
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'Todo',
        projectId: numericProjectId,
      },
    })

    return res.status(201).json(task)
  } catch (error) {
    console.error('Database error:', error)

    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

export async function updateTask(req, res) {
  const id = Number(req.params.id)

  const { title, description, status, projectId } = req.body

  const numericProjectId = Number(projectId)
  const validStatuses = ['Todo', 'In Progress', 'Completed']

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'Invalid task ID',
    })
  }

  if (!title?.trim() || !projectId) {
    return res.status(400).json({
      message: 'Title and projectId are required',
    })
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid task status',
    })
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      message: 'Description must be a string',
    })
  }

  if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
    return res.status(400).json({
      message: 'Invalid project ID',
    })
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
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: numericProjectId,
        client: {
          userId: req.user.userId,
        },
      },
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        projectId: numericProjectId,
      },
    })

    return res.json(updatedTask)
  } catch (error) {
    console.error('Database error:', error)

    return res.status(500).json({
      message: 'Something went wrong',
    })
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