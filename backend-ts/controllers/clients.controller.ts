import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";

// Define the expected client request body.
interface ClientBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
}

// Get all clients belonging to the authenticated user.
export async function getClients(
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

    const clients = await prisma.client.findMany({
      where: {
        userId,
      },
    });

    res.json(clients);
  } catch (error: unknown) {
    console.error("Error fetching clients:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a client for the authenticated user.
export async function createClient(
  req: Request<Record<string, string>, unknown, ClientBody>,
  res: Response
): Promise<void> {
  const { name, email, company } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Validate the input types.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string"
  ) {
    res.status(400).json({
      message: "Name, email, and company are required",
    });
    return;
  }

  // Normalize the input.
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompany = company.trim();

  if (!normalizedName || !normalizedEmail || !normalizedCompany) {
    res.status(400).json({
      message: "Name, email, and company are required",
    });
    return;
  }

  // Validate the email format.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    res.status(400).json({
      message: "Please enter a valid email address",
    });
    return;
  }

  try {
    const client = await prisma.client.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: normalizedCompany,
        userId,
      },
    });

    res.status(201).json(client);
  } catch (error: unknown) {
    // Handle an email that already exists.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "A client with this email already exists",
      });
      return;
    }

    console.error("Error creating client:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a client belonging to the authenticated user.
export async function updateClient(
  req: Request<{ id: string }, unknown, ClientBody>,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  const { name, email, company } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Validate the client ID.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid client ID",
    });
    return;
  }

  // Validate the input types.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string"
  ) {
    res.status(400).json({
      message: "Name, email, and company are required",
    });
    return;
  }

  // Normalize the input.
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompany = company.trim();

  if (!normalizedName || !normalizedEmail || !normalizedCompany) {
    res.status(400).json({
      message: "Name, email, and company are required",
    });
    return;
  }

  // Validate the email format.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    res.status(400).json({
      message: "Please enter a valid email address",
    });
    return;
  }

  try {
    // Confirm that this client belongs to the authenticated user.
    const client = await prisma.client.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    const updatedClient = await prisma.client.update({
      where: {
        id,
      },
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: normalizedCompany,
      },
    });

    res.json(updatedClient);
  } catch (error: unknown) {
    // Handle an email that already exists.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "A client with this email already exists",
      });
      return;
    }

    console.error("Error updating client:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a client belonging to the authenticated user.
export async function deleteClient(
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

  // Validate the client ID.
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid client ID",
    });
    return;
  }

  try {
    // Confirm that this client belongs to the authenticated user.
    const client = await prisma.client.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    // Database cascade rules also delete related projects and tasks.
    await prisma.client.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Client deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting client:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}