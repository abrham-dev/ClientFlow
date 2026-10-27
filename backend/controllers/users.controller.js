
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function getMe(req, res) {
  try {
    // Get the ID of the authenticated user from the verified JWT.
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
  // Safely handle a missing request body.
  const { username, email, currentPassword, password } = req.body ?? {};

  const userId = req.user.userId;

  // Check that at least one profile field is being updated.
  if (
    username === undefined &&
    email === undefined &&
    password === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  // Validate the username.
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

  // Validate the optional email address.
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

      // An empty email means the user wants to remove it.
      if (normalizedEmail === "") {
        normalizedEmail = null;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
          return res.status(400).json({
            message: "Please enter a valid email address",
          });
        }
      }
    }
  }

  // Require the current password for every profile update.
  if (
    typeof currentPassword !== "string" ||
    currentPassword.length === 0
  ) {
    return res.status(400).json({
      message: "Current password is required to update your profile",
    });
  }

  // Validate a new password, if provided.
  if (password !== undefined) {
    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
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
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Verify the current password before allowing changes.
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Prepare only the fields that the user wants to update.
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

    return res.json(updatedUser);
  } catch (error) {
    // Handle duplicate usernames or email addresses.
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error("Error updating profile:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}