
import prisma from "../lib/prisma.js";

// Get all clients belonging to the authenticated user.
export async function getClients(req, res) {
  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: req.user.userId,
      },
    });

    return res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Create a client for the authenticated user.
export async function createClient(req, res) {
  const { name, email, company } = req.body ?? {};

  // Validate the input types.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string"
  ) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  // Remove unnecessary spaces and normalize the email.
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompany = company.trim();

  if (!normalizedName || !normalizedEmail || !normalizedCompany) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  // Validate the email format.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  try {
    const client = await prisma.client.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: normalizedCompany,
        userId: req.user.userId,
      },
    });

    return res.status(201).json(client);
  } catch (error) {
    // Handle an email that already exists.
    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "A client with this email already exists",
      });
    }

    console.error("Error creating client:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update a client belonging to the authenticated user.
export async function updateClient(req, res) {
  const id = Number(req.params.id);
  const { name, email, company } = req.body ?? {};

  // Validate the client ID.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  // Validate the input types.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string"
  ) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  // Normalize the input.
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompany = company.trim();

  if (!normalizedName || !normalizedEmail || !normalizedCompany) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  try {
    // Confirm that this client belongs to the authenticated user.
    const client = await prisma.client.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
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

    return res.json(updatedClient);
  } catch (error) {
    // Handle an email that already exists.
    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "A client with this email already exists",
      });
    }

    console.error("Error updating client:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Delete a client belonging to the authenticated user.
export async function deleteClient(req, res) {
  const id = Number(req.params.id);

  // Validate the client ID.
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
    // Confirm that this client belongs to the authenticated user.
    const client = await prisma.client.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // The database cascade rules also delete this client's projects and tasks.
    await prisma.client.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
