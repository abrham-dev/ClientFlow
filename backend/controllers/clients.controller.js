import prisma from "../lib/prisma.js";

export async function getClients(req, res) {
  let clients;

  try {
    clients = await prisma.client.findMany({
      where: {
        userId: req.user.userId,
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.json(clients);
}


export async function createClient(req, res) {
  const { name, email, company } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  let client;

  try {
    client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        userId: req.user.userId,
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  res.status(201).json(client);
}

export async function updateClient(req, res) {
  const id = Number(req.params.id);

  const { name, email, company } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  if (!name || !email || !company) {
    return res.status(400).json({
      message: "Name, email, and company are required",
    });
  }

  try {
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
        name,
        email,
        company,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.log("Database error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function deleteClient(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid client ID",
    });
  }

  try {
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

    await prisma.client.delete({
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
    message: "Client deleted successfully",
  });
}