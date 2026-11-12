import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Define the structure of our JWT payload.
interface AuthenticatedUser extends JwtPayload {
  userId: number;
  username: string;
}

// Extend Express Request to support the user property.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Check that the JWT secret is configured.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured");
    res.status(500).json({
      message: "Our systems are experiencing temporary issues. Please refresh the page.",
    });
    return;
  }

  // Read the Authorization header.
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  // Extract the token after "Bearer ".
  const token = authHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  try {
    // Verify the token.
    const decoded = jwt.verify(token, jwtSecret);

    // Check that the token contains the expected user information.
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "number" ||
      typeof decoded.username !== "string"
    ) {
      res.status(401).json({
        message: "Invalid or expired token",
      });
      return;
    }

    // Attach the authenticated user to the request.
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    // Continue to the next middleware or route handler.
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
    return;
  }
}

