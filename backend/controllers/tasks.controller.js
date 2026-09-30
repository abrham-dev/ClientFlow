import prisma from "../lib/prisma.js";

export async function getTasks(req, res) {
  const tasks = await prisma.task.findMany();

  res.json(tasks);
}

export async function createTask(req, res) {
  const { title, description, completed, projectId } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      completed,
      projectId,
    },
  });

  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const id = Number(req.params.id);
  const { title, description, completed, projectId } = req.body;

  const task = await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      completed,
      projectId,
    },
  });

  res.json(task);
}

export async function deleteTask(req, res) {
  const id = Number(req.params.id);

  await prisma.task.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "Task deleted successfully",
  });
}