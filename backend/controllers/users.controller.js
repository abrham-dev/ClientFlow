import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function getMe(req, res) {
  try {
    const userId = req.user.userId;

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
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function updateMe(req, res) {
  const userId = req.user.userId;

  const {
    username,
    email,
    currentPassword,
    password,
  } = req.body;

  // 1. Check that at least one profile field is being updated
  if (
    username === undefined &&
    email === undefined &&
    password === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  // 2. Validate username
  if (username !== undefined) {
    if (
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      return res.status(400).json({
        message: "Username must be at least 3 characters",
      });
    }
  }

  // 3. Validate optional email
  let normalizedEmail;

  if (email !== undefined) {
    if (email === null) {
      normalizedEmail = null;
    } else if (typeof email !== "string") {
      return res.status(400).json({
        message: "Email must be a string",
      });
    } else {
      normalizedEmail = email.trim().toLowerCase();

      // An empty email means the user wants to remove it
      if (normalizedEmail === "") {
        normalizedEmail = null;
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      ) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }
    }
  }

  // 4. Require the current password for every profile update
  if (
    typeof currentPassword !== "string" ||
    currentPassword.length === 0
  ) {
    return res.status(400).json({
      message: "Current password is required to update your profile",
    });
  }

  // 5. Validate a new password, if provided
  if (password !== undefined) {
    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }
  }

  try {
    // 6. Retrieve the existing password hash
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 7. Verify the current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // 8. Prepare the fields to update
    const updateData = {};

    if (username !== undefined) {
      updateData.username = username.trim();
    }

    if (email !== undefined) {
      updateData.email = normalizedEmail;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 9. Update the user without returning the password
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

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}