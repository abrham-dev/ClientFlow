import prisma from "../lib/prisma.js";

export async function getClients(req, res) {
  const clients = await prisma.client.findMany();

  res.json(clients);
}

export async function createClient(req, res) {
  const { name, email, company, userId } = req.body;

  const client = await prisma.client.create({
    data: {
      name,
      email,
      company,
      userId,
    },
  });

  res.status(201).json(client);
}

export async function updateClient(req, res) {
  const id = Number(req.params.id);
  const { name, email, company, userId } = req.body;

  const client = await prisma.client.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      company,
      userId
    },
  });

  res.json(client);
}

export async function deleteClient(req, res) {
  const id = Number(req.params.id);

  await prisma.client.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "Client deleted successfully",
  });
}