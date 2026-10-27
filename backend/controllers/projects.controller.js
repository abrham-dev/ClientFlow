
import prisma from "../lib/prisma.js";

// Get all projects belonging to the authenticated user.
export async function getProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        // A project belongs to a user through its client.
        client: {
          userId: req.user.userId,
        },
      },
    });

    return res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a project for a client owned by the authenticated user.
export async function createProject(req, res) {
  const { name, status, clientId, description } = req.body ?? {};

  // Check that required fields are provided.
  if (
    name === undefined ||
    status === undefined ||
    clientId === undefined ||
    clientId === null ||
    clientId === ""
  ) {
    return res.status(400).json({
      message: "Name, status, and clientId are required",
    });
  }

  // Validate the types of the project fields.
  if (
    typeof name !== "string" ||
    typeof status !== "string" ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    return res.status(400).json({
      message: "Invalid project data",
    });
  }

  // Normalize the input values.
  const normalizedName = name.trim();
  const normalizedStatus = status.trim();
  const normalizedDescription =
    typeof description === "string"
      ? description.trim() || null
      : null;

  if (!normalizedName || !normalizedStatus) {
    return res.status(400).json({
      message: "Name and status cannot be empty",
    });
  }

  // Convert the client ID to a number and validate it.
  const numericClientId = Number(clientId);

  if (
    !Number.isInteger(numericClientId) ||
    numericClientId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
    // Confirm that the selected client belongs to this user.
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

    // Create the project and connect it to the selected client.
    const project = await prisma.project.create({
      data: {
        name: normalizedName,
        description: normalizedDescription,
        status: normalizedStatus,
        clientId: numericClientId,
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a project belonging to the authenticated user.
export async function updateProject(req, res) {
  const id = Number(req.params.id);
  const { name, status, clientId, description } = req.body ?? {};

  // Validate the project ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  // Check that required fields are provided.
  if (
    name === undefined ||
    status === undefined ||
    clientId === undefined ||
    clientId === null ||
    clientId === ""
  ) {
    return res.status(400).json({
      message: "Name, status, and clientId are required",
    });
  }

  // Validate the types of the project fields.
  if (
    typeof name !== "string" ||
    typeof status !== "string" ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    return res.status(400).json({
      message: "Invalid project data",
    });
  }

  // Normalize the input values.
  const normalizedName = name.trim();
  const normalizedStatus = status.trim();
  const normalizedDescription =
    typeof description === "string"
      ? description.trim() || null
      : null;

  if (!normalizedName || !normalizedStatus) {
    return res.status(400).json({
      message: "Name and status cannot be empty",
    });
  }

  // Convert and validate the new client ID.
  const numericClientId = Number(clientId);

  if (
    !Number.isInteger(numericClientId) ||
    numericClientId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
    // Confirm that the existing project belongs to this user.
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

    // Confirm that the destination client also belongs to this user.
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

    // Update the project with the validated values.
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name: normalizedName,
        description: normalizedDescription,
        status: normalizedStatus,
        clientId: numericClientId,
      },
    });

    return res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a project belonging to the authenticated user.
export async function deleteProject(req, res) {
  const id = Number(req.params.id);

  // Validate the project ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  try {
    // Confirm that the project belongs to this user.
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

    // The database cascade rule automatically deletes the project's tasks.
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
