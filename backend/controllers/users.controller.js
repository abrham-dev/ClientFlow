import prisma from "../lib/prisma.js";

export async function getUsers(req, res) {
  const users = await prisma.user.findMany();

  res.json(users);
};

export async function createUser(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  res.status(201).json(user);
}
export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const { username, password } = req.body;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
      password,
    },
  });

  res.json(user);
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);

  await prisma.user.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "User deleted successfully",
  });
}