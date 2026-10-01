import prisma from "../lib/prisma.js";

export async function getTasks(req, res) {
  const tasks = await prisma.task.findMany({
    where: {
      project: {
        client: {
          userId: req.user.userId,
        },
      },
    },
  });

  res.json(tasks);
}

export async function createTask(req, res) {
  const { title, description, completed, projectId } = req.body;

  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
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
      projectId: Number(projectId),
    },
  });

  res.status(201).json(task);
}


export async function updateTask(req, res) {
  const id = Number(req.params.id);

  const { title, description, completed, projectId } = req.body;

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

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      completed,
      projectId: Number(projectId),
    },
  });

  res.json(updatedTask);
}


export async function deleteTask(req, res) {
  const id = Number(req.params.id);

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

  res.json({
    message: "Task deleted successfully",
  });
}