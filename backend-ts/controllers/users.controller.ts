import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Define the possible fields in an update request.
interface UpdateMeBody {
  username?: unknown;
  email?: unknown;
  currentPassword?: unknown;
  password?: unknown;
}

// Get the authenticated user's profile.
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    // Get the ID from the verified JWT.
    const userId = req.user?.userId;

    if (userId === undefined) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json(user);
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// Update the authenticated user's profile.
export async function updateMe(
  req: Request<Record<string, string>, unknown, UpdateMeBody>,
  res: Response
): Promise<void> {
  const { username, email, currentPassword, password } = req.body ?? {};

  const userId = req.user?.userId;

  if (userId === undefined) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Check that at least one profile field is being updated.
  if (
    username === undefined &&
    email === undefined &&
    password === undefined
  ) {
    res.status(400).json({
      message: "At least one field is required",
    });
    return;
  }

  // Validate the username.
  if (username !== undefined) {
    if (
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      res.status(400).json({
        message: "Username must be at least 3 characters",
      });
      return;
    }
  }

  // Validate and normalize the email.
  let normalizedEmail: string | null | undefined;

  if (email !== undefined) {
    if (email === null) {
      normalizedEmail = null;
    } else if (typeof email !== "string") {
      res.status(400).json({
        message: "Email must be a string",
      });
      return;
    } else {
      normalizedEmail = email.trim().toLowerCase();

      // An empty email means the user wants to remove it.
      if (normalizedEmail === "") {
        normalizedEmail = null;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
          res.status(400).json({
            message: "Please enter a valid email address",
          });
          return;
        }
      }
    }
  }

  // Validate password change information.
  let currentPasswordValue = "";

  if (password !== undefined) {
    if (
      typeof currentPassword !== "string" ||
      currentPassword.length === 0
    ) {
      res.status(400).json({
        message: "Current password is required to change your password",
      });
      return;
    }

    currentPasswordValue = currentPassword;

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      res.status(400).json({
        message: "New password must be at least 8 characters",
      });
      return;
    }
  }

  try {
    // Retrieve the existing password hash.
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Verify the current password before changing it.
    if (password !== undefined) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPasswordValue,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        res.status(401).json({
          message: "Current password is incorrect",
        });
        return;
      }
    }

    // Prepare only the fields that need updating.
    const updateData: Prisma.UserUpdateInput = {};

    if (username !== undefined) {
      updateData.username = username.trim();
    }

    if (normalizedEmail !== undefined) {
      updateData.email = normalizedEmail;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user without returning the password hash.
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json(updatedUser);
  } catch (error: unknown) {
    // Handle duplicate usernames or email addresses.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "Username or email already exists",
      });
      return;
    }

    console.error("Error updating profile:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}