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

  if (!username && !password) {
    return res.status(400).json({
      message: "Username or password is required",
    });
  }

  if (username !== undefined && username.length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters",
    });
  }

  if (password !== undefined && password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const updateData = {};

  if (username) {
    updateData.username = username;
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  let updatedUser;

  try {
    updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
      },
    });
  } catch (error) {
  console.log("Database error:", error);

  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
  });
}}