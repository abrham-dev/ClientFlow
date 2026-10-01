import prisma from "../lib/prisma.js";

export async function getProjects(req, res) {
  const projects = await prisma.project.findMany({
    where: {
      client: {
        userId: req.user.userId,
      },
    },
  });

  res.json(projects);
}

export async function createProject(req, res) {
  const { name, description, status, clientId } = req.body;

  const client = await prisma.client.findFirst({
    where: {
      id: Number(clientId),
      userId: req.user.userId,
    },
  });

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status,
      clientId: Number(clientId),
    },
  });

  res.status(201).json(project);
}


export async function updateProject(req, res) {
  const id = Number(req.params.id);

  const { name, description, status, clientId } = req.body;

  const project = await prisma.project.findFirst({
    where: {
      id,
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

  const updatedProject = await prisma.project.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      status,
      clientId,
    },
  });

  res.json(updatedProject);
}


export async function deleteProject(req, res) {
  const id = Number(req.params.id);

  const project = await prisma.project.findFirst({
    where: {
      id,
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

  await prisma.project.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "Project deleted successfully",
  });
}