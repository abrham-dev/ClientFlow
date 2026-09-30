import prisma from "../lib/prisma.js";

export async function getProjects(req, res) {
  const projects = await prisma.project.findMany();

  res.json(projects);
}
export async function createProject(req, res) {
  const { name, description, status, clientId } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status,
      clientId,
    },
  });

  res.status(201).json(project);
}
export async function updateProject(req, res) {
  const id = Number(req.params.id);
  const { name, description, status, clientId } = req.body;

  const project = await prisma.project.update({
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

  res.json(project);
}
export async function deleteProject(req, res) {
  const id = Number(req.params.id);

  await prisma.project.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "Project deleted successfully",
  });
}