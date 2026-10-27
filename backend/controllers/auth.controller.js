
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body ?? {};

  // Validate input types.
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Username, email, and password must be text",
    });
  }

  // Normalize username and email before saving.
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required",
    });
  }

  // Validate the email format.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // Validate username and password lengths.
  if (normalizedUsername.length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  try {
    // Hash the password before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Never return the password or password hash to the client.
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle duplicate usernames or emails.
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error("Registration failed:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function login(req, res) {
  const { username, password } = req.body ?? {};

  // Validate input types.
  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Username and password must be text",
    });
  }

  const normalizedUsername = username.trim();

  if (!normalizedUsername || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Ensure the JWT secret is configured before signing a token.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      message: "Internal server error",
    });
  }

  try {
    // Find the user by username.
    const user = await prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
    });

    // Use the same error message for an unknown username
    // and an incorrect password.
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare the submitted password with the stored hash.
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Create a token containing the user's identity.
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

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}