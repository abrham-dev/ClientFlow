import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the expected registration request body.
interface RegisterBody {
  username?: unknown;
  email?: unknown;
  password?: unknown;
}

// Define the expected login request body.
interface LoginBody {
  username?: unknown;
  password?: unknown;
}

// Register a new user.
export async function register(
  req: Request<Record<string, string>, unknown, RegisterBody>,
  res: Response
): Promise<void> {
  const { username, email, password } = req.body ?? {};

  // Validate input types.
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      message: "Username, email, and password must be text",
    });
    return;
  }

  // Normalize username and email before saving.
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    res.status(400).json({
      message: "Username, email, and password are required",
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

  // Validate username and password lengths.
  if (normalizedUsername.length < 3) {
    res.status(400).json({
      message: "Username must be at least 3 characters",
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      message: "Password must be at least 6 characters",
    });
    return;
  }

  // Check JWT configuration.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured");

    res.status(500).json({
  message: "Our systems are experiencing temporary issues. Please refresh the page."
    });
    return;
  }

  try {
    // Hash the password before storing it.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Generate a JWT.
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    // Return user information without the password.
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    // Handle duplicate usernames or emails.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "Username or email already exists",
      });
      return;
    }

    console.error("Registration failed:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Log in an existing user.
export async function login(
  req: Request<Record<string, string>, unknown, LoginBody>,
  res: Response
): Promise<void> {
  const { username, password } = req.body ?? {};

  // Validate input types.
  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      message: "Username and password must be text",
    });
    return;
  }

  const normalizedUsername = username.trim();

  if (!normalizedUsername || !password) {
    res.status(400).json({
      message: "Username and password are required",
    });
    return;
  }

  // Check JWT configuration.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured");

    res.status(500).json({
     message: "Something went wrong on our end. Please try again in a few moments.",
    });
    return;
  }

  try {
    // Find the user by username.
    const user = await prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
    });

    // Reject unknown usernames.
    if (!user) {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }

    // Compare the submitted password with its stored hash.
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }

    // Generate a JWT.
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error: unknown) {
    console.error("Login failed:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}