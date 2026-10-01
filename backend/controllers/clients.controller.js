import prisma from "../lib/prisma.js";

export async function getClients(req, res) {
  const clients = await prisma.client.findMany({
    where: {
      userId: req.user.userId,
    },
  });

  res.json(clients);
}

export async function createClient(req, res) {
  const { name, email, company} = req.body;

  const client = await prisma.client.create({
    data: {
      name,
      email,
      company,
      userId: req.user.userId
    },
  });

  res.status(201).json(client);
}

export async function updateClient(req, res) {
  const id = Number(req.params.id);

  const { name, email, company } = req.body;

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
}

export async function deleteClient(req, res) {
  const id = Number(req.params.id);

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

  res.json({
    message: "Client deleted successfully",
  });
}