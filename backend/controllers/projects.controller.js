import prisma from "../lib/prisma.js";

export async function getProjects(req, res) {
  let projects;

  try {
    projects = await prisma.project.findMany({
      where: {
        client: {
          userId: req.user.userId,
        },
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.json(projects);
}


export async function createProject(req, res) {
  const { name, status, clientId } = req.body;
const description = req.body.description?.trim() || null;

  const numericClientId = Number(clientId);

  if (!name || !status || !clientId) {
    return res.status(400).json({
      message: "Name, status, and clientId are required",
    });
  }

  if (!Number.isInteger(numericClientId) || numericClientId <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
    const client = await prisma.client.findFirst({
      where: {
        id: numericClientId,
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
        clientId: numericClientId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function updateProject(req, res) {
  const id = Number(req.params.id);

  const { name, status, clientId } = req.body;
const description = req.body.description?.trim() || null;

  const numericClientId = Number(clientId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  if (!name || !status || !clientId) {
    return res.status(400).json({
      message: "Name, description, status, and clientId are required",
    });
  }

  if (!Number.isInteger(numericClientId) || numericClientId <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
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

    const client = await prisma.client.findFirst({
      where: {
        id: numericClientId,
        userId: req.user.userId,
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
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
        clientId: numericClientId,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


export async function deleteProject(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  try {
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
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.json({
    message: "Project deleted successfully",
  });
}