import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function getMe(req, res) {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
}

export async function updateMe(req, res) {
  const userId = req.user.userId;

  const { username, password } = req.body;

  const updateData = {};

  if (username) {
    updateData.username = username;
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    select: {
      id: true,
      username: true,
    },
  });

  res.json(updatedUser);
}