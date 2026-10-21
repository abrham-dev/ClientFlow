import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Username, email, and password must be text",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!username.trim() || !normalizedEmail || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.log("Database error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({
      message: "username and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
}