import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Define the expected project request body.
interface ProjectBody {
  name?: unknown;
  status?: unknown;
  clientId?: unknown;
  description?: unknown;
}

// Define the allowed project statuses.
const validProjectStatuses = [
  "Planning",
  "Active",
  "Completed",
] as const;

type ProjectStatus = (typeof validProjectStatuses)[number];

// Check whether a project status is valid.
function isValidProjectStatus(
  value: string
): value is ProjectStatus {
  return (validProjectStatuses as readonly string[]).includes(value);
}

// Get all projects belonging to the authenticated user.
export async function getProjects(
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

    const projects = await prisma.project.findMany({
      where: {
        // A project belongs to a user through its client.
        client: {
          userId,
        },
      },
    });

    res.json(projects);
  } catch (error: unknown) {
    console.error("Error fetching projects:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a project for a client owned by the authenticated user.
export async function createProject(
  req: Request<Record<string, string>, unknown, ProjectBody>,
  res: Response
): Promise<void> {
  const { name, status, clientId, description } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Check that required fields are provided.
  if (
    name === undefined ||
    status === undefined ||
    clientId === undefined ||
    clientId === null ||
    clientId === ""
  ) {
    res.status(400).json({
      message: "Name, status, and clientId are required",
    });
    return;
  }

  // Validate the types of the project fields.
  if (
    typeof name !== "string" ||
    typeof status !== "string" ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    res.status(400).json({
      message: "Invalid project data",
    });
    return;
  }

  // Normalize the input values.
  const normalizedName = name.trim();
  const normalizedStatus = status.trim();
  const normalizedDescription =
    typeof description === "string"
      ? description.trim() || null
      : null;

  if (!normalizedName) {
    res.status(400).json({
      message: "Project name cannot be empty",
    });
    return;
  }

  if (!isValidProjectStatus(normalizedStatus)) {
    res.status(400).json({
      message: "Invalid project status",
    });
    return;
  }

  // Convert the client ID to a number and validate it.
  const numericClientId = Number(clientId);

  if (
    !Number.isInteger(numericClientId) ||
    numericClientId <= 0
  ) {
    res.status(400).json({
      message: "Invalid client ID",
    });
    return;
  }

  try {
    // Confirm that the selected client belongs to this user.
    const client = await prisma.client.findFirst({
      where: {
        id: numericClientId,
        userId,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
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

    res.status(201).json(project);
  } catch (error: unknown) {
    console.error("Error creating project:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a project belonging to the authenticated user.
export async function updateProject(
  req: Request<{ id: string }, unknown, ProjectBody>,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  const { name, status, clientId, description } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Validate the project ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid project ID",
    });
    return;
  }

  // Check that required fields are provided.
  if (
    name === undefined ||
    status === undefined ||
    clientId === undefined ||
    clientId === null ||
    clientId === ""
  ) {
    res.status(400).json({
      message: "Name, status, and clientId are required",
    });
    return;
  }

  // Validate the types of the project fields.
  if (
    typeof name !== "string" ||
    typeof status !== "string" ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    res.status(400).json({
      message: "Invalid project data",
    });
    return;
  }

  // Normalize the input values.
  const normalizedName = name.trim();
  const normalizedStatus = status.trim();
  const normalizedDescription =
    typeof description === "string"
      ? description.trim() || null
      : null;

  if (!normalizedName) {
    res.status(400).json({
      message: "Project name cannot be empty",
    });
    return;
  }

  if (!isValidProjectStatus(normalizedStatus)) {
    res.status(400).json({
      message: "Invalid project status",
    });
    return;
  }

  // Convert and validate the new client ID.
  const numericClientId = Number(clientId);

  if (
    !Number.isInteger(numericClientId) ||
    numericClientId <= 0
  ) {
    res.status(400).json({
      message: "Invalid client ID",
    });
    return;
  }

  try {
    // Confirm that the existing project belongs to this user.
    const project = await prisma.project.findFirst({
      where: {
        id,
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

    // Confirm that the destination client also belongs to this user.
    const client = await prisma.client.findFirst({
      where: {
        id: numericClientId,
        userId,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
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

    res.json(updatedProject);
  } catch (error: unknown) {
    console.error("Error updating project:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a project belonging to the authenticated user.
export async function deleteProject(
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

  // Validate the project ID from the URL.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid project ID",
    });
    return;
  }

  try {
    // Confirm that the project belongs to this user.
    const project = await prisma.project.findFirst({
      where: {
        id,
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

    // Database cascade rules automatically delete related tasks.
    await prisma.project.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting project:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}